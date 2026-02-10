Tienda Online de Piezas para Todoterrenos

Proyecto de tienda online de piezas para todoterrenos, desarrollado con Laravel en el backend y React + Redux en el frontend. Permite a los usuarios registrarse, iniciar sesión (incluyendo Google), gestionar su carrito de compras y consultar sus pedidos.

Tecnologías

Backend: Laravel 10, PHP 8.x

Frontend: React, Redux, React Router

Base de datos: MySQL / MariaDB

Autenticación: Laravel Sanctum, OAuth con Google

Gestión de estado: Redux

Llamadas API: Axios

Funcionalidades

Registro de usuario y autenticación tradicional

Inicio de sesión con Google

Visualización y búsqueda de productos

Añadir productos al carrito de compras

Guardar y consultar pedidos

Gestión de perfil de usuario

Instalación

Clonar el repositorio:

git@github.com:antoniojoaquin102349/Tienda-React-Laravel.git

Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed # opcional
php artisan serve

Frontend (React)
cd frontend
npm install
npm start

Uso

Registrarse o iniciar sesión (incluyendo Google)

Explorar productos y añadirlos al carrito

Confirmar pedidos

Revisar historial de pedidos en el perfil

Estructura
/backend       # Laravel API
/frontend      # React + Redux
