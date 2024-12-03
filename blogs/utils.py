import requests

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # Return the first IP from the list in X-Forwarded-For header
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        # Fallback to REMOTE_ADDR
        ip = request.META.get('REMOTE_ADDR', '').strip()
    return ip


def get_public_ip():
    try:
        response = requests.get('https://api.ipify.org?format=json', timeout=5)
        response.raise_for_status()
        public_ip = response.json().get('ip')
        return public_ip
    except requests.RequestException as e:
        print(f"Error fetching public IP: {e}")
        return None


def get_user_country(request):

    # Extract the IP address of the user
    ip = get_client_ip(request)
    if ip in ['127.0.0.1', 'localhost']:
        ip = get_public_ip()

    if not ip:
        return "Unknown"

    try:
        # Fetch geolocation data using the IP-API service
        response = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get('status') == 'success':
            return data.get('country', 'Unknown')
        else:
            return "Unknown"
    except requests.RequestException as e:
        print(f"Error fetching country for IP {ip}: {e}")
        return "Unknown"
