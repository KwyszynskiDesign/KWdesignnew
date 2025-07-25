<?php
/*
 * Prosty skrypt PHP do obsługi formularza kontaktowego.
 * Jeśli serwer obsługuje PHP, możesz ustawić atrybut `action` w
 * formularzu na tę ścieżkę, aby wysyłać wiadomości e‑mail bezpośrednio
 * z poziomu strony. Skrypt wykorzystuje funkcję `mail()` wbudowaną w
 * PHP. Upewnij się, że serwer jest odpowiednio skonfigurowany do
 * wysyłania wiadomości.
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    $package = isset($_POST['package']) ? trim($_POST['package']) : '';

    // Adres odbiorcy – zmień na swój adres e‑mail
    $to = 'kontakt@kwyszynski.pl';
    $subject = "Nowa wiadomość z formularza od $name";
    $body = "Imię: $name\nEmail: $email\nPakiet: $package\n\nWiadomość:\n$message";
    $headers = "From: <$email>";

    if (mail($to, $subject, $body, $headers)) {
        echo 'Wiadomość została wysłana. Dziękuję za kontakt.';
    } else {
        echo 'Wystąpił błąd podczas wysyłania wiadomości.';
    }
    exit;
}
?>