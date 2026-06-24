<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class Producto extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'producto';
    protected $primaryKey = 'id_producto';
    public    $timestamps = false;

    protected $fillable = [
        'id_categoria', 'id_proveedor', 'nombre', 'descripcion',
        'codigo_barras', 'codigo_qr', 'codigo_interno', 'unidad_medida',
        'precio_costo', 'precio_venta', 'stock_minimo', 'activo',
    ];

    protected $casts = [
        'activo'        => 'boolean',
        'precio_costo'  => 'decimal:2',
        'precio_venta'  => 'decimal:2',
        'stock_minimo'  => 'integer',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaProducto::class, 'id_categoria', 'id_categoria');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function inventarios()
    {
        return $this->hasMany(Inventario::class, 'id_producto', 'id_producto');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'id_producto', 'id_producto');
    }
    public static function normalizarCodigo(?string $codigo): string
    {
        if ($codigo === null || $codigo === '') {
            return '';
        }

        return preg_replace('/[\s\-]/', '', trim($codigo));
    }

    public static function variantesCodigo(string $codigo): array
    {
        $variantes = array_unique(array_filter([
            trim($codigo),
            self::normalizarCodigo($codigo),
        ]));

        $normalizado = self::normalizarCodigo($codigo);
        if ($normalizado !== '' && ctype_digit($normalizado)) {
            $sinCeros = ltrim($normalizado, '0') ?: '0';
            $variantes[] = $sinCeros;
            $variantes[] = str_pad($sinCeros, 13, '0', STR_PAD_LEFT);
            $variantes[] = str_pad($sinCeros, 12, '0', STR_PAD_LEFT);
            $variantes[] = str_pad($sinCeros, 8, '0', STR_PAD_LEFT);
        }

        return array_values(array_unique(array_filter($variantes)));
    }

    public static function codigosDesdeEscaneo(string $raw): array
    {
        $codigos = self::variantesCodigo($raw);

        $json = json_decode($raw, true);
        if (is_array($json)) {
            foreach (['codigo', 'codigo_barras', 'codigo_interno', 'codigo_qr', 'sku'] as $key) {
                if (!empty($json[$key])) {
                    $codigos = array_merge($codigos, self::variantesCodigo((string) $json[$key]));
                }
            }
            if (!empty($json['id_producto'])) {
                $codigos[] = (string) $json['id_producto'];
            }
        }

        if (filter_var($raw, FILTER_VALIDATE_URL)) {
            $query = parse_url($raw, PHP_URL_QUERY);
            if ($query) {
                parse_str($query, $params);
                foreach (['codigo', 'codigo_barras', 'id', 'sku'] as $key) {
                    if (!empty($params[$key])) {
                        $codigos = array_merge($codigos, self::variantesCodigo((string) $params[$key]));
                    }
                }
            }
        }

        return array_values(array_unique(array_filter($codigos)));
    }

    public static function buscarPorCodigo(string $codigo): ?self
    {
        $variantes = self::codigosDesdeEscaneo($codigo);
        if (empty($variantes)) {
            return null;
        }

        $normalizados = array_values(array_unique(array_map(
            fn ($v) => self::normalizarCodigo($v),
            $variantes
        )));

        $sqlNorm = "REPLACE(REPLACE(COALESCE(%s,''), ' ', ''), '-', '')";

        return static::where('activo', true)
            ->where(function ($q) use ($variantes, $normalizados, $sqlNorm) {
                $q->whereIn('codigo_barras', $variantes)
                  ->orWhereIn('codigo_qr', $variantes)
                  ->orWhereIn('codigo_interno', $variantes);

                foreach ($normalizados as $norm) {
                    if ($norm === '') {
                        continue;
                    }
                    $q->orWhereRaw(sprintf($sqlNorm, 'codigo_barras') . ' = ?', [$norm])
                      ->orWhereRaw(sprintf($sqlNorm, 'codigo_interno') . ' = ?', [$norm])
                      ->orWhereRaw(sprintf($sqlNorm, 'codigo_qr') . ' = ?', [$norm]);
                }
            })
            ->first();
    }
}

