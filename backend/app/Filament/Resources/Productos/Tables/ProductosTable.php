<?php

namespace App\Filament\Resources\Productos\Tables;


use Filament\Tables\Table;
use Filament\Tables;

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
            ]);
    }
}