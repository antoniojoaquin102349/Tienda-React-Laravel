<?php

namespace App\Filament\Resources;

use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use App\Models\Producto;
use Filament\Tables;

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
            Select::make('categoria') 
            ->options([
                'carroceria' => 'Carrocería',
                'suspension' => 'Suspensión',
                'mecanica' => 'Mecánica',
                'ruedas' => 'Ruedas',
                'electricidad' => 'Electricidad',
                'accesorios' => 'Accesorios',
            ])
            ->required()
             ->default('Accesorios'),
            TextInput::make('precio')->numeric()->prefix('€')->required(),
            TextInput::make('stock')->numeric()->default(0)->required(),
            TextInput::make('vendido')->numeric()->default(0)->label('Vendidos'),
            RichEditor::make('descripcion')->columnSpanFull(),
            FileUpload::make('imagen')
                ->image()
                ->disk('public')               // <-- ESTO hace que vaya a storage/app/public
                ->visibility('public')         // <-- Asegura acceso público
                ->directory('productos')       // <-- Subcarpeta
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('referencia')->searchable(),
                Tables\Columns\TextColumn::make('categoria')->searchable(),
                Tables\Columns\TextColumn::make('precio')->searchable()->money('eur'),
                Tables\Columns\TextColumn::make('stock')->searchable()->sortable()->badge(),
                Tables\Columns\TextColumn::make('vendido')->searchable()->sortable()->label('Vendidos'),
            ])
            ->actions([
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