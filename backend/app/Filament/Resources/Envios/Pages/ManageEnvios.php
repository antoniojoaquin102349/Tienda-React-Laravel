<?php

namespace App\Filament\Resources\EnviosResource\Pages;

use App\Filament\Resources\EnviosResource;
use Filament\Resources\Pages\ManageRecords;

class ManageEnvios extends ManageRecords
{
    protected static string $resource = EnviosResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }

}