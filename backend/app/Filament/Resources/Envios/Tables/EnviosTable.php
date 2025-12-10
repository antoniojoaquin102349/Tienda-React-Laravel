<?php

namespace App\Filament\Resources\Envios\Tables;

use Filament\Tables\Table;
use Filament\Tables;


class EnviosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('pedido_id')
                    ->label('Nº Pedido')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('nombre_cliente')
                    ->label('Cliente')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('telefono')
                    ->label('Teléfono')
                    ->searchable(),

                Tables\Columns\TextColumn::make('direccion')
                    ->label('Dirección')
                    ->searchable(),

                Tables\Columns\TextColumn::make('ciudad')
                    ->label('Ciudad')
                    ->searchable(),

                Tables\Columns\TextColumn::make('codigo_postal')
                    ->label('Código postal')
                    ->searchable(),

                Tables\Columns\TextColumn::make('nombre_producto')
                    ->label('Producto')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('referencia')
                    ->label('Referencia')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('cantidad')
                    ->label('Cantidad')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('estado')
                    ->colors([
                        'warning' => 'Pendiente',
                        'inf'     => 'Enviado',
                        'primary' => 'En transito',
                        'success' => 'Entregao',
                        'danger'  => 'Devuelto',
                    ])
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('enviado_at')
                    ->label('Enviado')
                    ->searchable()
                    ->dateTime('d/m/Y H:i'),

                Tables\Columns\TextColumn::make('entregado_at')
                    ->label('Entregado')
                    ->searchable()
                    ->dateTime('d/m/Y H:i'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ]);
    }
}


