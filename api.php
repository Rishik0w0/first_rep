<?php
// Portfolio Manager API
// Using only MySQL, HTML, CSS, and JavaScript

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$path_parts = explode('/', trim($path, '/'));

// Get the endpoint
$endpoint = end($path_parts);

switch ($method) {
    case 'GET':
        switch ($endpoint) {
            case 'portfolio':
                getPortfolio();
                break;
            case 'settings':
                getSettings();
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
                break;
        }
        break;
        
    case 'POST':
        switch ($endpoint) {
            case 'portfolio':
                addStock();
                break;
            case 'settings':
                updateSettings();
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
                break;
        }
        break;
        
    case 'PUT':
        switch ($endpoint) {
            case 'settings':
                updateSettings();
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
                break;
        }
        break;
        
    case 'DELETE':
        if (strpos($endpoint, 'portfolio/') === 0) {
            $id = substr($endpoint, 10); // Remove 'portfolio/' prefix
            deleteStock($id);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getPortfolio() {
    global $conn;
    
    $sql = "SELECT * FROM portfolio ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $holdings = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $holdings[] = [
                'id' => $row['id'],
                'symbol' => $row['symbol'],
                'quantity' => $row['quantity'],
                'buyPrice' => $row['buy_price'],
                'purchaseDate' => $row['purchase_date'],
                'currentPrice' => $row['current_price'],
                'totalCost' => $row['total_cost'],
                'totalValue' => $row['total_value'],
                'gainLoss' => $row['gain_loss'],
                'gainLossPercent' => $row['gain_loss_percent']
            ];
        }
    }
    
    // Calculate summary
    $totalValue = array_sum(array_column($holdings, 'totalValue'));
    $totalCost = array_sum(array_column($holdings, 'totalCost'));
    $totalGainLoss = $totalValue - $totalCost;
    $totalGainLossPercent = $totalCost > 0 ? ($totalGainLoss / $totalCost) * 100 : 0;
    
    $summary = [
        'totalValue' => $totalValue,
        'totalCost' => $totalCost,
        'totalGainLoss' => $totalGainLoss,
        'totalGainLossPercent' => $totalGainLossPercent,
        'holdingsCount' => count($holdings)
    ];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'holdings' => $holdings,
            'summary' => $summary
        ]
    ]);
}

function addStock() {
    global $conn;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['symbol']) || !isset($data['quantity']) || !isset($data['buyPrice']) || !isset($data['purchaseDate'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $symbol = strtoupper($data['symbol']);
    $quantity = $data['quantity'];
    $buyPrice = $data['buyPrice'];
    $purchaseDate = $data['purchaseDate'];
    $totalCost = $quantity * $buyPrice;
    
    $sql = "INSERT INTO portfolio (symbol, quantity, buy_price, purchase_date, current_price, total_cost, total_value, gain_loss, gain_loss_percent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $currentPrice = $buyPrice; // In real app, fetch from API
    $totalValue = $quantity * $currentPrice;
    $gainLoss = $totalValue - $totalCost;
    $gainLossPercent = $totalCost > 0 ? ($gainLoss / $totalCost) * 100 : 0;
    
    $stmt->bind_param("sdddsdddd", $symbol, $quantity, $buyPrice, $purchaseDate, $currentPrice, $totalCost, $totalValue, $gainLoss, $gainLossPercent);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Stock added successfully',
            'data' => [
                'id' => $conn->insert_id,
                'symbol' => $symbol
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add stock']);
    }
    
    $stmt->close();
}

function deleteStock($id) {
    global $conn;
    
    $sql = "DELETE FROM portfolio WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Stock deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete stock']);
    }
    
    $stmt->close();
}

function getSettings() {
    global $conn;
    
    $sql = "SELECT setting_key, setting_value FROM user_settings";
    $result = $conn->query($sql);
    
    $settings = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $key = $row['setting_key'];
            $value = $row['setting_value'];
            
            // Convert snake_case to camelCase
            $camelKey = str_replace('_', '', lcfirst(ucwords($key, '_')));
            
            // Parse boolean values
            if ($value === 'true') $value = true;
            else if ($value === 'false') $value = false;
            else if (is_numeric($value)) $value = floatval($value);
            
            $settings[$camelKey] = $value;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $settings
    ]);
}

function updateSettings() {
    global $conn;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid settings data']);
        return;
    }
    
    foreach ($data as $key => $value) {
        // Convert camelCase to snake_case
        $dbKey = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
        $stringValue = is_bool($value) ? ($value ? 'true' : 'false') : strval($value);
        
        $sql = "INSERT INTO user_settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $dbKey, $stringValue);
        $stmt->execute();
        $stmt->close();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Settings updated successfully',
        'data' => $data
    ]);
}

$conn->close();
?>