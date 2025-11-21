<?php

namespace App\Filament\Resources\Productos\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // IMAGEN - ahora sí aparece y bien bonita
                ImageColumn::make('imagen')
                    ->label('Imagen')
                    ->width(70)
                    ->height(70)
                    ->defaultImageUrl(asset('images/no-image.png')) // opcional: imagen por defecto
                    ->circular()
                    ->visibility('public'), // importante si usas storage disk public

                TextColumn::make('referencia')
                    ->label('Ref')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('nombre')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->limit(40),

                TextColumn::make('precio')
                    ->label('Precio')
                    ->money('eur')
                    ->sortable(),

                TextColumn::make('stock')
                    ->label('Stock')
                    ->badge()
                    ->color(fn ($state) => 
                        $state == 0 ? 'danger' : 
                        ($state <= 10 ? 'warning' : 'success')
                    ),

                // OPCIONAL: mostrar un trozo de la descripción
                TextColumn::make('descripcion')
                    ->label('Descripción')
                    ->limit(60)
                    ->tooltip(function ($record) {
                        return strip_tags($record->descripcion);
                    })
                    ->html()
                    ->toggleable(isToggledHiddenByDefault: true), // se oculta por defecto, se activa con el ojito
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }
}