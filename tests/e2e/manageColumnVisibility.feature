Feature: Manage Column Visibility
	As a user
	I want to show or hide specific columns in the table
	So that I can focus on the information that matters to me

	Scenario: User opens the manage columns panel
		Given I am on the home page
		When I click the Manage Columns button
		Then I should see column toggles for "Favorite Color" and "Last Login"

	Scenario: User sees all manageable columns checked by default
		Given I am on the home page
		When I click the Manage Columns button
		Then all column checkboxes should be checked

	Scenario: User hides a column and it disappears from the table
		Given I am on the home page
		When I click the Manage Columns button
		And I uncheck the "Favorite Color" column
		Then the table should not show the "Favorite Color" column

	Scenario: User hides a column and re-enables it
		Given I am on the home page
		When I click the Manage Columns button
		And I uncheck the "Last Login" column
		And I check the "Last Login" column
		Then the table should show the "Last Login" column

	Scenario: User deselects all columns using Select All
		Given I am on the home page
		When I click the Manage Columns button
		And I uncheck the "Select All" checkbox
		Then the table should not show the "Favorite Color" column
		And the table should not show the "Last Login" column

	Scenario: User selects all columns using Select All
		Given I am on the home page
		When I click the Manage Columns button
		And I uncheck the "Select All" checkbox
		And I check the "Select All" checkbox
		Then the table should show the "Favorite Color" column
		And the table should show the "Last Login" column

	Scenario: User searches for a column in the manage columns panel
		Given I am on the home page
		When I click the Manage Columns button
		And I type "color" in the column search box
		Then I should only see the "Favorite Color" column toggle
		And I should not see the "Last Login" column toggle
