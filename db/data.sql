-- Insert sample countries
INSERT INTO Countries (CountryName, CountryCode, Continent, PhoneCode, CurrencyCode, CurrencyName, PostalCode)
VALUES
    ('Poland', 'PL', 'Europe', '48', 'PLN', 'PLN', '##-###'),
    ('United States', 'US', 'North America', '1', 'USD', 'US Dollar', '#####'),
    ('Germany', 'DE', 'Europe', '49', 'EUR', 'Euro', '#####'),
    ('France', 'FR', 'Europe', '33', 'EUR', 'Euro', '#####')
ON CONFLICT (CountryCode) DO NOTHING;

-- Insert sample cities for Poland
INSERT INTO Cities (CountryID, CityName)
VALUES
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'PL'), 'Warsaw'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'PL'), 'Kraków'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'PL'), 'Łódź'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'PL'), 'Wrocław'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'PL'), 'Poznań')
ON CONFLICT DO NOTHING;

-- Insert sample cities for United States
INSERT INTO Cities (CountryID, CityName)
VALUES
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'US'), 'New York'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'US'), 'Los Angeles'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'US'), 'Chicago'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'US'), 'Houston'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'US'), 'Phoenix')
ON CONFLICT DO NOTHING;

-- Insert sample cities for Germany
INSERT INTO Cities (CountryID, CityName)
VALUES
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'DE'), 'Berlin'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'DE'), 'Hamburg'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'DE'), 'Munich'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'DE'), 'Cologne'),
    ((SELECT CountryID FROM Countries WHERE CountryCode = 'DE'), 'Frankfurt')
ON CONFLICT DO NOTHING;

-- Verify the inserted data
SELECT c.CountryName, ci.CityName 
FROM Countries c
JOIN Cities ci ON c.CountryID = ci.CountryID
ORDER BY c.CountryName, ci.CityName;

--------------------------------------------------------------
-- Example using Poland and Łódź
SELECT register_user(
    'anhelina', 
    '12345', 
    'anhelinamendohralo@gmail.com', 
    (SELECT CountryID FROM Countries WHERE CountryCode = 'PL'),  -- Poland
    (SELECT CityID FROM Cities WHERE CityName = 'Łódź' AND CountryID = (SELECT CountryID FROM Countries WHERE CountryCode = 'PL')),
    'Test Street', 
    '90-001', 
    'PLN',  -- Currency
    'pol'   -- Language code for Polish
);