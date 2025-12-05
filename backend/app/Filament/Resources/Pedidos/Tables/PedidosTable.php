<?php

namespace App\Filament\Resources\Pedidos\Tables;

use Filament\Tables\Table;
use Filament\Tables;


class PedidosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Filament\Tables\Columns\TextColumn::make('id')
                    ->searchable()
                    ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('id_user')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('total')
                    ->searchable()
                    ->sortable()
                    ->money('eur'),
                \Filament\Tables\Columns\TextColumn::make('metodo_envio')
                    ->searchable()
                    ->sortable(),  
                \Filament\Tables\Columns\TextColumn::make('estado')
                    ->colors([
                        'warning' => 'Pendiente',
                        'inf'     => 'enviado',
                        'primary' => 'En transito',
                        'success' => 'Entregao',
                        'danger'  => 'Devuelto',
                    ])
                    ->searchable()
                    ->sortable(),              
            ])
            ->filters([
                //
            ]);
    }
}