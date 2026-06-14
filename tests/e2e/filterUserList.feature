Feature: Filter User List
	As a user
	I want to filter the user list by column
	So that I can quickly find specific users

	Scenario: User opens the filter panel
		Given I am on the home page
		When I click the Filters button
		Then I should see filter inputs for "Name", "Job", "Company", and "Location"

	Scenario: User filters by name and sees matching results
		Given I am on the home page
		When I click the Filters button
		And I type "Ari" in the "Name" filter
		Then the table should display 1 user
		And I should see a user named "Ari Nugroho"

	Scenario: User filters by job and sees matching results
		Given I am on the home page
		When I click the Filters button
		And I type "Engineer" in the "Job" filter
		Then the table should only show users whose job contains "Engineer"

	Scenario: User filters by company and sees matching results
		Given I am on the home page
		When I click the Filters button
		And I type "TechFlow" in the "Company" filter
		Then the table should display 1 user
		And I should see a user named "David Chen"

	Scenario: User filters by location and sees matching results
		Given I am on the home page
		When I click the Filters button
		And I type "Indonesia" in the "Location" filter
		Then the table should display 1 user
		And I should see a user named "Ari Nugroho"

	Scenario: User filters with no matching results
		Given I am on the home page
		When I click the Filters button
		And I type "nomatch" in the "Name" filter
		Then the table should display no users

	Scenario: User resets filters and sees all users again
		Given I am on the home page
		When I click the Filters button
		And I type "Ari" in the "Name" filter
		And I click the Reset Filters button
		Then the table should display 10 users
