Feature: View User List
	As a user
	I want to see a list of all users in a table
	So that I can get an overview of all registered users

	Scenario: User sees the user list table on the home page
		Given I am on the home page
		When I look at the page
		Then I should see a table titled "All Users"

	Scenario: User sees all users in the table
		Given I am on the home page
		When I look at the table
		Then the table should display 10 users

	Scenario: User sees the correct column headers
		Given I am on the home page
		When I look at the table headers
		Then the table should have the following columns
			| Name | Job | Company | Location |

	Scenario: User sees complete information for each user
		Given I am on the home page
		When I look at the table
		Then I should see the following users
			| Name            | Job               | Company              | Location      |
			| Ari Nugroho     | Frontend Engineer | Nusa Digital         | Indonesia     |
			| Mika Tanaka     | Product Designer  | Kumo Labs            | Japan         |
			| Raka Pratama    | QA Engineer       | Orbit Systems        | Singapore     |
			| Sarah Coleman   | Data Analyst      | Northwind            | United States |
			| David Chen      | Backend Developer | TechFlow             | Taiwan        |
			| Emma Watson     | UX Designer       | Design Hub           | UK            |
			| Raj Patel       | DevOps Engineer   | Cloud Systems        | India         |
			| Lisa Anderson   | Project Manager   | Enterprise Solutions | Canada        |
			| Carlos Martinez | Security Engineer | SecureNet            | Mexico        |
			| Sophie Laurent  | ML Engineer       | AI Innovations       | France        |
