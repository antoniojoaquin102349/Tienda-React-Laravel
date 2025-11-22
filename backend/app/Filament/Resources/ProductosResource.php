<?php

namespace App\Filament\Resources;

use App\Models\Producto;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;

class ProductosResource extends Resource
{
    protected static ?string $model = Producto::class;

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-rectangle-stack';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('referencia')->required()->unique(ignoreRecord: true),
            TextInput::make('nombre')->required(),
            TextInput::make('categoria')->required(),
            TextInput::make('precio')->numeric()->prefix('€')->required(),
            TextInput::make('stock')->numeric()->default(0)->required(),
            TextInput::make('vendido')->numeric()->default(0)->label('Vendidos'),
            RichEditor::make('descripcion')->columnSpanFull(),
            FileUpload::make('imagen')->image()->directory('productos')->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('referencia')->searchable(),
                Tables\Columns\TextColumn::make('categoria')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('precio')->money('eur'),
                Tables\Columns\TextColumn::make('stock')->badge(),
                Tables\Columns\TextColumn::make('vendido')->label('Vendidos')->sortable(),
            ])
            ->actions([
                \Filament\Actions\ViewAction::make(),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\ProductosResource\Pages\ManageProductos::route('/'),
        ];
    }
}