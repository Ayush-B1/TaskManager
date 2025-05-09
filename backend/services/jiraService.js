const JiraApi = require('jira-client');

const jira = new JiraApi({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

const jiraService = {
  createIssue: async (task) => {
    try {
      console.log('Creating Jira issue for task:', {
        title: task.title,
        project: process.env.JIRA_PROJECT_KEY
      });

      const issueData = {
        fields: {
          project: {
            key: process.env.JIRA_PROJECT_KEY
          },
          summary: task.title,
          description: task.description,
          issuetype: {
            name: 'Task'
          },
          priority: {
            name: task.priority || 'Medium'
          }
        }
      };

      console.log('Jira API request payload:', JSON.stringify(issueData, null, 2));
      const issue = await jira.addNewIssue(issueData);
      console.log('Jira issue created successfully:', issue.key);
      return issue;
    } catch (error) {
      console.error('Error creating Jira issue:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateIssue: async (issueKey, task) => {
    try {
      console.log('Updating Jira issue:', issueKey, {
        title: task.title,
        status: task.status
      });

      const updateData = {
        fields: {
          summary: task.title,
          description: task.description,
          status: {
            name: task.status
          }
        }
      };

      console.log('Jira API update payload:', JSON.stringify(updateData, null, 2));
      await jira.updateIssue(issueKey, updateData);
      console.log('Jira issue updated successfully:', issueKey);
    } catch (error) {
      console.error('Error updating Jira issue:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

module.exports = jiraService;