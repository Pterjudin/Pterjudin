const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const GITHUB_TOKEN = process.env.PAT_TOKEN;
const USERNAME = 'Pterjudin';

const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json'
};

const fetchGitHubData = async () => {
    const query = `
    {
        user(login: "${USERNAME}") {
            contributionsCollection {
                totalCommitContributions
                restrictedContributionsCount
                totalPullRequestContributions
                totalIssueContributions
            }
            repositories(first: 100, ownerAffiliations: OWNER) {
                totalCount
            }
            organizations(first: 10) {
                totalCount
                nodes {
                    name
                    repositories {
                        totalCount
                    }
                }
            }
        }
    }`;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query: query },
            { headers: headers }
        );

        if (response.status !== 200) {
            throw new Error(`GitHub API returned status ${response.status}: ${response.statusText}`);
        }

        return response.data.data;

    } catch (error) {
        console.error('Error fetching data from GitHub API:', error.message || error);
        process.exit(1);  // Exit the script with a failure code
    }
};

const updateReadme = async () => {
    const data = await fetchGitHubData();

    if (!data || !data.user) {
        console.error("Failed to retrieve user data.");
        process.exit(1);
    }

    const totalCommits = data.user.contributionsCollection.totalCommitContributions;
    const privateContributions = data.user.contributionsCollection.restrictedContributionsCount;
    const totalPRs = data.user.contributionsCollection.totalPullRequestContributions;
    const totalIssues = data.user.contributionsCollection.totalIssueContributions;
    const orgs = data.user.organizations.nodes.map(org => `- **${org.name}**: ${org.repositories.totalCount} repositories`).join('\n');

    const readmeContent = `
<h2 align="center">Hello there! <img src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif" width="30px"></h2>

<p align="center">
  <a href="https://github.com/DenverCoder1/readme-typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1100&width=800&lines=I'm+Tajudeen+Oyindamola+T.;I'm+a+Software+Engineer+and+DevOps+and+Cloud+Enthusiast."></a>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=Pterjudin&label=Profile%20views&color=0e75b6&style=flat" alt="Profile Views" />
</p>

## ⚡️ About Me

- ✨ I’m **Tajudeen Oyindamola**.
- 👨‍💻 A Software Engineer with expertise in creating technology solutions that address critical challenges.
- 🔭 I specialize in backend development, data science, and DevOps.
- 🌱 Constantly learning new technologies and improving my skill set.
- 💬 Passionate about contributing to impactful projects and initiatives.
- 🎉 **Fun Fact**: I enjoy contributing to open source projects and writing technical content.

## 🔥 GitHub Analytics

- **Total Commits**: ${totalCommits}
- **Private Contributions**: ${privateContributions}
- **Total PRs**: ${totalPRs}
- **Total Issues**: ${totalIssues}
- **Organizations**:
${orgs}

## 🌐 Connect with Me

<p align="center">
   <a href="https://www.linkedin.com/in/tajudeen-oyindamola/"><img src="https://img.shields.io/badge/-Tajudeen%20Oyindamola-blue?style=plastic&labelColor=blue&logo=LinkedIn&link=linkedin.com/in/tajudeen-oyindamola" alt="LinkedIn Badge"></a> 
   <a href="mailto:tajudeenoyindamola@outlook.com"><img src="https://img.shields.io/badge/-Tajudeen%20Oyindamola-fff?style=plastic&labelColor=fff&logo=Gmail&link=mailto:tajudeenoyindamola@outlook.com" alt="Gmail Badge"></a>
</p>

## 🛠️ Tools and Technologies

- **Languages**: JavaScript, Python, Java
- **Frameworks**: React, Node.js, Django
- **DevOps Tools**: Docker, Kubernetes, Jenkins
- **Cloud**: AWS, Azure, GCP
- **Databases**: MySQL, PostgreSQL, MongoDB

## 📫 How to Reach Me

- **Email**: [tajudeenoyindamola@outlook.com](mailto:tajudeenoyindamola@outlook.com)
- **LinkedIn**: [Tajudeen Oyindamola](https://www.linkedin.com/in/tajudeen-oyindamola/)

## 🎉 Fun Fact

- I love to solve coding challenges and contribute to open-source projects in my free time.

---

*This README was generated with ❤️ by [Tajudeen Oyindamola T.](https://github.com/Pterjudin).*
    `;

    fs.writeFileSync('README.md', readmeContent);
};

updateReadme();