<?php

namespace App\Filament\Resources\Productos\Tables;

<<<<<<< HEAD
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
=======

use Filament\Tables\Table;
use Filament\Tables;
>>>>>>> feature

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
<<<<<<< HEAD
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
=======
                Tables\Filament\Tables\Columns\TextColumn::make('nombre')
                    ->searchable()
                    ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('referencia')
                    ->searchable()
                     ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('categoria')
                    ->searchable()
                    ->sortable(),
                \Filament\Tables\Columns\IconColumn::make('vendido')
                    ->label('Vendido')
                    ->searchable()
                    ->sortable()
                    ->color(fn ($state) => $state > 0 ? 'success' : 'secondary'),
                \Filament\Tables\Columns\TextColumn::make('precio')
                    ->searchable()
                    ->sortable()
                    ->money('eur'),
                \Filament\Tables\Columns\TextColumn::make('stock')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color(fn ($state) => $state <= 0 ? 'danger' : 'success'),
            ])
            ->filters([
                //
>>>>>>> feature
            ]);
    }
}