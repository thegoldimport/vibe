from typing import List, Dict

class AgencyTools:
    @staticmethod
    def website_audit(url: str) -> str:
        """Mocks a website audit tool."""
        return f"Audit results for {url}: Score 88/100. Good mobile responsiveness. Needs better ALT tags."

    @staticmethod
    def lead_search(niche: str, location: str) -> List[Dict]:
        """Mocks a lead search tool."""
        return [
            {"business_name": "Pro Roofing", "website": "proroofing.com", "email": "info@proroofing.com"},
            {"business_name": "Elite HVAC", "website": "elitehvac.net", "email": "contact@elitehvac.net"}
        ]

    @staticmethod
    def content_generator(topic: str, brand_voice: str) -> str:
        """Mocks a content generation tool."""
        return f"Generated blog post about {topic} in a {brand_voice} voice..."
