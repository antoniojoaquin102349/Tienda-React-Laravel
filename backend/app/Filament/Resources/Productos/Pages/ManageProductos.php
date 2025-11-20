<?php

namespace App\Filament\Resources\Productos\Pages;

use App\Filament\Resources\ProductosResource; // ✅ namespace correcto
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageProductos extends ManageRecords
{
    protected static string $resource = ProductosResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
