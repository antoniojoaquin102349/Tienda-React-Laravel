<?php

namespace App\Filament\Resources\Productos\Tables;

use Filament\Tables;
use Filament\Tables\Table;

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Filament\Tables\Columns\TextColumn::make('nombre')
                    ->searchable()
                    ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('referencia')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('precio')
                    ->money('eur')
                    ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('stock')
                    ->badge()
                    ->color(fn ($state) => $state <= 0 ? 'danger' : 'success'),
            ])
            ->filters([
                //
            ]);
    }
}