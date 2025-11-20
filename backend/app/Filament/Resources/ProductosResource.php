<?php

namespace App\Filament\Resources;

use App\Models\Producto;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\ViewRecordAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Productos\Pages;
use App\Filament\Resources\Productos\Pages\ManageProductos;
use Filament\Tables\Actions\ActionGroup;


class ProductosResource extends Resource
{
    protected static ?string $model = Producto::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('referencia')->required()->unique(),
            TextInput::make('nombre')->required(),
            TextInput::make('precio')->numeric()->required(),
            TextInput::make('stock')->numeric()->required()->default(0),
            RichEditor::make('descripcion')->nullable(),
            FileUpload::make('imagen')->image()->directory('productos')->nullable(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('nombre')->searchable(),
            TextColumn::make('referencia')->searchable(),
            TextColumn::make('precio')->money('eur'),
            TextColumn::make('stock')->badge(),
        ]);
    
    }

    public static function getPages(): array
    {
        return [
            // Solo index porque ManageRecords maneja create/edit automáticamente
            'index' => Pages\ManageProductos::route('/'),
        ];
    }
}