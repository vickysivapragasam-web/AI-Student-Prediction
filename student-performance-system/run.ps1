# Student Performance System - PowerShell Run Script
# This script starts all services for the Student Performance AI System

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart")]
    [string]$Action = "start"
)

# Colors for output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$BLUE = "Cyan"

# Function to write colored output
function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to check if a port is in use
function Test-PortInUse {
    param(
        [int]$Port,
        [string]$Name
    )
    
    $netstat = netstat -an | Select-String ":$Port\s" | Select-String "LISTENING"
    if ($netstat) {
        Write-ColoredOutput "[ERROR] Port $Port ($Name) is already in use" $RED
        return $true
    }
    return $false
}

# Function to start a service
function Start-ServiceProcess {
    param(
        [string]$Directory,
        [string]$Command,
        [string]$Name
    )

    Write-ColoredOutput "[*] Starting $Name in $Directory..." $BLUE
    
    try {
        if ($Command -eq "npm start") {
            Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm start" -NoNewWindow -WorkingDirectory $Directory
        }
        elseif ($Command -eq "python app.py") {
            Start-Process -FilePath "cmd.exe" -ArgumentList "/c uv run app.py" -NoNewWindow -WorkingDirectory $Directory
        }
        else {
            Start-Process -FilePath "powershell" -ArgumentList "-Command $Command" -NoNewWindow -WorkingDirectory $Directory
        }
        
        Write-ColoredOutput "[OK] $Name started" $GREEN
    }
    catch {
        Write-ColoredOutput "[ERROR] Failed to start $Name : $_" $RED
        throw
    }
}

# Function to stop services
function Stop-Services {
    Write-ColoredOutput "[STOP] Stopping all services..." $YELLOW
    
    $processNames = @("node", "python", "npm")
    
    foreach ($processName in $processNames) {
        $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($processes) {
            foreach ($proc in $processes) {
                if ($proc.StartTime -gt (Get-Date).AddMinutes(-30)) {
                    try {
                        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                        Write-ColoredOutput "[OK] Stopped $($proc.Name) (PID: $($proc.Id))" $GREEN
                    }
                    catch {
                        # Ignore errors
                    }
                }
            }
        }
    }
    
    # Clean up process tracking files
    Get-ChildItem -Path $PSScriptRoot -Filter ".*.process.json" -ErrorAction SilentlyContinue | Remove-Item -ErrorAction SilentlyContinue
    
    Write-ColoredOutput "[OK] Services stopped" $GREEN
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: $($MyInvocation.MyCommand.Name) [-Action] <start|stop|restart>"
    Write-Host ""
    Write-Host "Actions:"
    Write-Host "  start   - Start all services (default)"
    Write-Host "  stop    - Stop all services"
    Write-Host "  restart - Restart all services"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\run.ps1"
    Write-Host "  .\run.ps1 -Action start"
    Write-Host "  .\run.ps1 -Action stop"
    Write-Host "  .\run.ps1 -Action restart"
    exit 1
}

# Main logic - Start action
if ($Action -eq "start") {
    Write-ColoredOutput "[START] Starting Student Performance System..." $BLUE
    
    # Check if required tools are available
    $requiredCommands = @("node", "npm", "python")
    foreach ($cmd in $requiredCommands) {
        if (!(Get-Command $cmd -ErrorAction SilentlyContinue)) {
            Write-ColoredOutput "[ERROR] $cmd is not installed or not in PATH" $RED
            exit 1
        }
    }
    
    # Check if ports are available
    $portsToCheck = @(
        @{Port = 3000; Name = "Frontend (React)"},
        @{Port = 5000; Name = "Backend (Node.js)"},
        @{Port = 8000; Name = "AI Service (Flask)"}
    )
    
    foreach ($portInfo in $portsToCheck) {
        if (Test-PortInUse -Port $portInfo.Port -Name $portInfo.Name) {
            exit 1
        }
    }
    
    Write-ColoredOutput "[WARNING] Make sure MongoDB is running on port 27017" $YELLOW
    Write-ColoredOutput "           For Docker setup: MongoDB runs inside backend container" $YELLOW
    Write-ColoredOutput "           For local development: mongod" $YELLOW
    Write-Host ""
    
    # Start services in order
    Start-ServiceProcess -Directory "frontend" -Command "npm start" -Name "Frontend"
    Start-Sleep -Seconds 2
    
    Start-ServiceProcess -Directory "backend" -Command "npm start" -Name "Backend"
    Start-Sleep -Seconds 2
    
    Start-ServiceProcess -Directory "ai-service" -Command "python app.py" -Name "AI Service"
    
    Write-Host ""
    Write-ColoredOutput "[SUCCESS] All services started!" $GREEN
    Write-ColoredOutput "[UI] Frontend: http://localhost:3000" $BLUE
    Write-ColoredOutput "[API] Backend: http://localhost:5000" $BLUE
    Write-ColoredOutput "[ML] AI Service: http://localhost:8000" $BLUE
    Write-Host ""
    Write-ColoredOutput "[INFO] Press Ctrl+C to stop all services" $YELLOW
    
    # Keep script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    finally {
        Write-Host ""
        Stop-Services
    }
}
elseif ($Action -eq "stop") {
    Stop-Services
}
elseif ($Action -eq "restart") {
    Write-ColoredOutput "[RESTART] Restarting services..." $BLUE
    Stop-Services
    Start-Sleep -Seconds 2
    & $MyInvocation.MyCommand.Path -Action start
}
else {
    Show-Usage
}