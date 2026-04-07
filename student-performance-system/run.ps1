# Student Performance System - PowerShell Run Script
# This script starts all services for the Student Performance AI System

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart")]
    [string]$Action = "start"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$BLUE = "Cyan"
$RESET = "White"

# Function to write colored output
function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = $RESET
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to check if a port is in use
function Test-PortInUse {
    param(
        [int]$Port,
        [string]$Name
    )

    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            Write-ColoredOutput "❌ Port $Port ($Name) is already in use" $RED
            return $true
        }
    }
    catch {
        # Get-NetTCPConnection might not be available on older Windows versions
        # Fall back to netstat
        $netstat = netstat -an | Select-String ":$Port\s" | Select-String "LISTENING"
        if ($netstat) {
            Write-ColoredOutput "❌ Port $Port ($Name) is already in use" $RED
            return $true
        }
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

    Write-ColoredOutput "📁 Starting $Name in $Directory..." $BLUE

    Push-Location $Directory

    try {
        switch ($Command) {
            "npm start" {
                Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -WorkingDirectory $Directory
            }
            "python app.py" {
                Start-Process -FilePath "python" -ArgumentList "app.py" -NoNewWindow -WorkingDirectory $Directory
            }
            default {
                # For other commands, use PowerShell to execute
                Start-Process -FilePath "powershell" -ArgumentList "-Command $Command" -NoNewWindow -WorkingDirectory $Directory
            }
        }

        # Store process info for potential cleanup (simplified approach)
        $processInfo = @{
            Name = $Name
            Directory = $Directory
            Command = $Command
            StartTime = Get-Date
        }

        # Save process info to a JSON file for tracking
        $processInfo | ConvertTo-Json | Out-File -FilePath "$PSScriptRoot\.$Name.process.json" -Encoding UTF8

        Write-ColoredOutput "✅ $Name started" $GREEN
    }
    catch {
        Write-ColoredOutput "❌ Failed to start $Name`: $($_.Exception.Message)" $RED
        throw
    }
    finally {
        Pop-Location
    }
}

# Function to stop services
function Stop-Services {
    Write-ColoredOutput "🛑 Stopping all services..." $YELLOW

    # Kill processes by name patterns
    $processesToKill = @(
        "node",
        "python",
        "npm"
    )

    foreach ($processName in $processesToKill) {
        try {
            $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
            if ($processes) {
                foreach ($proc in $processes) {
                    # Only kill processes that might be related to our services
                    # This is a simplified approach - in production you'd want better process tracking
                    if ($proc.StartTime -gt (Get-Date).AddMinutes(-30)) {
                        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                        Write-ColoredOutput "✅ Stopped $($proc.Name) (PID: $($proc.Id))" $GREEN
                    }
                }
            }
        }
        catch {
            # Ignore errors when stopping processes
        }
    }

    # Clean up process tracking files
    Get-ChildItem -Path $PSScriptRoot -Filter ".*.process.json" | Remove-Item -ErrorAction SilentlyContinue

    Write-ColoredOutput "✅ Services stopped" $GREEN
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

# Main logic
switch ($Action) {
    "start" {
        Write-ColoredOutput "🚀 Starting Student Performance System..." $BLUE

        # Check if required tools are available
        $requiredCommands = @("node", "npm", "python")
        foreach ($cmd in $requiredCommands) {
            if (!(Get-Command $cmd -ErrorAction SilentlyContinue)) {
                Write-ColoredOutput "❌ $cmd is not installed or not in PATH" $RED
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

        Write-ColoredOutput "⚠️  Make sure MongoDB is running on port 27017" $YELLOW
        Write-ColoredOutput "   For Docker setup: MongoDB runs inside the backend container" $YELLOW
        Write-ColoredOutput "   For local development: mongod" $YELLOW
        Write-Host ""

        # Start services in order
        Start-ServiceProcess -Directory "frontend" -Command "npm start" -Name "Frontend"
        Start-Sleep -Seconds 2

        Start-ServiceProcess -Directory "backend" -Command "npm start" -Name "Backend"
        Start-Sleep -Seconds 2

        Start-ServiceProcess -Directory "ai-service" -Command "python app.py" -Name "AI Service"

        Write-Host ""
        Write-ColoredOutput "🎉 All services started!" $GREEN
        Write-ColoredOutput "📱 Frontend: http://localhost:3000" $BLUE
        Write-ColoredOutput "🔧 Backend: http://localhost:5000" $BLUE
        Write-ColoredOutput "🤖 AI Service: http://localhost:8000" $BLUE
        Write-Host ""
        Write-ColoredOutput "Press Ctrl+C to stop all services" $YELLOW

        # Keep the script running and handle Ctrl+C
        try {
            while ($true) {
                Start-Sleep -Seconds 1
            }
        }
        catch {
            # Handle Ctrl+C
            Write-Host ""
            Stop-Services
        }
    }

    "stop" {
        Stop-Services
    }

    "restart" {
        Write-ColoredOutput "🔄 Restarting services..." $BLUE
        Stop-Services
        Start-Sleep -Seconds 2
        & $MyInvocation.MyCommand.Path -Action start
    }

    default {
        Show-Usage
    }
}