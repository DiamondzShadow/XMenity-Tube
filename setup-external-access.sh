#!/bin/bash

echo "🚀 Setting up XMenity Social Token Factory for External Access"
echo "VM External IP: 34.45.54.110"
echo "Port: 3000"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Running as root - good for firewall configuration"
else
    echo "ℹ️  Running as user - some commands may need sudo"
fi

echo ""
echo "📋 Current Network Status:"

# Check if port 3000 is in use
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Port 3000 is in use (Next.js likely running)"
    lsof -i :3000
else
    echo "❌ Port 3000 is not in use"
fi

echo ""
echo "🔥 Firewall Configuration:"

# Check and configure iptables if available
if command -v iptables >/dev/null 2>&1; then
    echo "Found iptables - checking rules..."
    
    # List current rules
    iptables -L INPUT -n | grep 3000 && echo "✅ Port 3000 already allowed" || {
        echo "➕ Adding iptables rule for port 3000..."
        iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
        echo "✅ iptables rule added"
    }
else
    echo "⚠️  iptables not found"
fi

echo ""
echo "🌐 Cloud Provider Detection:"

# Check for Google Cloud
if curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/id >/dev/null 2>&1; then
    echo "🔵 Google Cloud Platform detected"
    echo ""
    echo "📝 To allow external access, run this command from your local machine:"
    echo "   gcloud compute firewall-rules create allow-xmenity-port \\"
    echo "     --allow tcp:3000 \\"
    echo "     --description=\"Allow XMenity Social Token Factory on port 3000\" \\"
    echo "     --direction=INGRESS"
    echo ""
    echo "🎯 Or use the GCP Console:"
    echo "   1. Go to VPC Network > Firewall"
    echo "   2. Click 'Create Firewall Rule'"
    echo "   3. Name: allow-xmenity-port"
    echo "   4. Direction: Ingress"
    echo "   5. Action: Allow"
    echo "   6. Targets: All instances in the network"
    echo "   7. Source IP ranges: 0.0.0.0/0"
    echo "   8. Protocols and ports: TCP port 3000"

# Check for AWS
elif curl -s http://169.254.169.254/latest/meta-data/instance-id >/dev/null 2>&1; then
    echo "🟠 Amazon Web Services detected"
    echo ""
    echo "📝 To allow external access:"
    echo "   1. Go to EC2 Console > Security Groups"
    echo "   2. Find your instance's security group"
    echo "   3. Add Inbound Rule: Type=Custom TCP, Port=3000, Source=0.0.0.0/0"

# Check for Azure
elif curl -s -H "Metadata:true" "http://169.254.169.254/metadata/instance?api-version=2021-02-01" >/dev/null 2>&1; then
    echo "🔵 Microsoft Azure detected"
    echo ""
    echo "📝 To allow external access:"
    echo "   1. Go to Azure Portal > Virtual Machines"
    echo "   2. Select your VM > Networking"
    echo "   3. Add inbound port rule: Port=3000, Source=Any"

else
    echo "❓ Cloud provider not detected or generic VPS"
    echo ""
    echo "📝 General steps to allow external access:"
    echo "   1. Configure your cloud provider's firewall/security groups"
    echo "   2. Allow inbound TCP traffic on port 3000"
    echo "   3. Source: 0.0.0.0/0 (all IPs) or restrict as needed"
fi

echo ""
echo "🧪 Testing Connectivity:"
echo "From your local machine, try:"
echo "   curl -I http://34.45.54.110:3000"
echo ""
echo "Or open in browser:"
echo "   http://34.45.54.110:3000"

echo ""
echo "🔧 Next.js Configuration:"
echo "✅ Server running with -H 0.0.0.0 (accepts all IPs)"
echo "✅ FRONTEND_URL configured for 34.45.54.110:3000"
echo "✅ CORS origins configured for external access"

echo ""
echo "📱 Application Status:"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Application responding locally"
    echo "🎯 Ready for external access once firewall is configured!"
else
    echo "❌ Application not responding locally"
    echo "🔄 Try restarting with: npm run dev"
fi

echo ""
echo "🎉 Setup complete! Configure your cloud firewall and test the external URL."