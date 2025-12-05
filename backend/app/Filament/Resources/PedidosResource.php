<?php

namespace App\Filament\Resources;

use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use App\Models\Pedido;
use Filament\Tables;





class PedidosResource extends Resource
{
    protected static ?string $model = Pedido::class;

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-rectangle-stack';
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->searchable()->sortable()->label('id del pedido'),
                Tables\Columns\TextColumn::make('user_id')->searchable()->label('id del usuario'),
                Tables\Columns\TextColumn::make('total')->searchable()->money('eur'),
                Tables\Columns\TextColumn::make('metodo_envio')->searchable()->sortable()->badge(),
                Tables\Columns\TextColumn::make('estado')->searchable()->sortable()->badge(),
                
            ])
            ->actions([
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\PedidosResource\Pages\ManagePedidos::route('/'),
        ];
    }
}