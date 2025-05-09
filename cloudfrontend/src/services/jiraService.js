import JiraClient from 'jira-client';

const jiraClient = new JiraClient({
  protocol: 'https',
  host: process.env.VITE_JIRA_HOST,
  username: process.env.VITE_JIRA_EMAIL,
  password: process.env.VITE_JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

export const jiraService = {
  // Get Jira issue
  getIssue: async (issueKey) => {
    try {
      return await jiraClient.findIssue(issueKey);
    } catch (error) {
      console.error('Error fetching Jira issue:', error);
      throw error;
    }
  },

  // Create Jira issue
  createIssue: async (task) => {
    try {
      const issueData = {
        fields: {
          project: { key: process.env.VITE_JIRA_PROJECT_KEY },
          summary: task.title,
          description: task.description,
          issuetype: { name: 'Task' },
          priority: { name: task.priority },
          assignee: { name: task.assignedUser }
        }
      };
      return await jiraClient.addNewIssue(issueData);
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  },

  // Update Jira issue
  updateIssue: async (issueKey, task) => {
    try {
      const issueData = {
        fields: {
          summary: task.title,
          description: task.description,
          priority: { name: task.priority },
          assignee: { name: task.assignedUser }
        }
      };
      return await jiraClient.updateIssue(issueKey, issueData);
    } catch (error) {
      console.error('Error updating Jira issue:', error);
      throw error;
    }
  }
};