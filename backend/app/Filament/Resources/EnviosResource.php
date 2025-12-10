<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EnviosResource\Pages;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use App\Models\Envio;
use Filament\Tables;


class EnviosResource extends Resource
{
    protected static ?string $model = Envio::class;

     public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-rectangle-stack';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([

            Select::make('estado')
            ->label('Estado')
            ->options([
                'pendiente' => 'Pendiente',
                'enviado' => 'Enviado',
                'entregado' => 'Entregado',
                'en_transito'=> ' En transito',
                'devuelto' => 'Devuelto',
            ])
            ->required()
            ->default('pendiente'),    

            TextInput::make('transportista')
                ->label('Transportista'),    
                    
            TextInput::make('numero_seguimiento')
                ->label('nº seguimiento'),
                     
        ]);
    }

    public static function table(Table $table): Table
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
                ->sortable(),

            Tables\Columns\TextColumn::make('direccion')
                ->label('Dirección')
                ->searchable()
                ->sortable()
                ->limit(40)
                ->tooltip(fn($record) => $record->direccion . ', ' . $record->ciudad . ' ' . $record->codigo_postal),

            Tables\Columns\TextColumn::make('ciudad')
                ->searchable()    
                ->sortable(),

            Tables\Columns\TextColumn::make('codigo_postal')
                ->label('CP')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('referencia')
                ->label('Referencia')
                ->searchable()
                ->sortable(), 

            Tables\Columns\TextColumn::make('nombre_producto')
                ->label('Producto')
                ->searchable(),

            Tables\Columns\TextColumn::make('cantidad')
                ->label('Cantidad')
                ->searchable(),

            Tables\Columns\TextColumn::make('metodo_envio')
                ->label('Método de envío')
                ->searchable()
                ->sortable(),

            Tables\Columns\BadgeColumn::make('estado')
                ->label('Estado')
                ->searchable()
                ->sortable(),
            
            Tables\Columns\TextColumn::make('transportista')
                ->label('Transportista')
                ->searchable(),    
                    
            Tables\Columns\TextColumn::make('numero_seguimiento')
                ->label('nº seguimiento')
                ->searchable(),

            Tables\Columns\TextColumn::make('enviado_at')
                    ->label('Enviado')
                    ->searchable()
                    ->sortable(),    
                
            Tables\Columns\TextColumn::make('entregado_at')
                    ->label('Entregado')
                    ->searchable()
                    ->sortable(),    

            Tables\Columns\TextColumn::make('created_at')
                ->label('Fecha pedido')
                ->searchable()
                ->sortable()
                ->dateTime('d/m/Y H:i'),      
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('estado')
                    ->options([
                        'pendiente' => 'Pendiente',
                        'completado' => 'Completado',
                        'cancelado' => 'Cancelado',
                    ]),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ]);
            
    }

    public static function getDefaultTableSortColumn(): ?string
    {
        return 'pedidos.id'; // esta columna existe porque es pedidos.id
    }

    public static function getDefaultTableSortDirection(): ?string
    {
        return 'desc';
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageEnvios::route('/'),
        ];
    }
}