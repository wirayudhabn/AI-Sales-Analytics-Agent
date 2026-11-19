<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
  public function index(Request $request)
  {
    // Validasi query parameters sesuai OpenAPI
    $validator = Validator::make($request->all(), [
      'page'     => 'sometimes|integer|min:1',
      'limit'    => 'sometimes|integer|min:1|max:100',
      'search'   => 'sometimes|string',
      'category' => 'sometimes|in:Kopi,Minuman,Makanan,Snack,Dessert',
    ]);

    if ($validator->fails()) {
      $errors = collect($validator->errors()->messages())->map(function ($messages, $field) {
        return [
          'field'   => $field,
          'message' => $messages[0],
        ];
      })->values();

      return response()->json([
        'success' => false,
        'message' => 'Validasi gagal',
        'errors'  => $errors,
      ], 422);
    }

    $page  = (int) $request->query('page', 1);
    $limit = (int) $request->query('limit', 10);

    $query = Product::query();

    // Filter pencarian berdasarkan nama atau kode produk (case-insensitive)
    if ($request->filled('search')) {
      $search = preg_quote($request->query('search'), '/');
      $query->where(function ($q) use ($search) {
        $q->where('name', 'regexp', "/{$search}/i")
          ->orWhere('product_code', 'regexp', "/{$search}/i");
      });
    }

    // Filter kategori
    if ($request->filled('category')) {
      $query->where('category', $request->query('category'));
    }

    // Pagination
    $paginator = $query->orderBy('product_code', 'asc')
      ->paginate($limit, ['*'], 'page', $page);

    // Mapping format sesuai schema Product di OpenAPI
    $products = collect($paginator->items())->map(function ($product) {
      return [
        '_id'           => (string) $product->_id,
        'product_code'  => $product->product_code,
        'name'          => $product->name,
        'category'      => $product->category,
        'selling_price' => (float) $product->selling_price,
        'cost_price'    => $product->cost_price !== null ? (float) $product->cost_price : null,
        'is_active'     => (bool) $product->is_active,
        'createdAt'     => $product->createdAt?->utc()->format('Y-m-d\TH:i:s.v\Z'),
        'updatedAt'     => $product->updatedAt?->utc()->format('Y-m-d\TH:i:s.v\Z'),
      ];
    });

    return response()->json([
      'data'       => $products,
      'pagination' => [
        'page'        => $paginator->currentPage(),
        'limit'       => $paginator->perPage(),
        'total_items' => $paginator->total(),
        'total_pages' => $paginator->lastPage(),
      ],
    ], 200);
  }
}
