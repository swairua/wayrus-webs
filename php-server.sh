#!/bin/bash
# PHP Development Server for api.php

echo "Starting PHP development server on localhost:8000"
echo "Serving api.php for API requests"
echo ""

php -S localhost:8000 -t . api-router.php
