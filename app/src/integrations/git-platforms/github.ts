import axios from 'axios';
import {ProjectEntity} from '../../models/project';
import {GitPlatformEntity} from '../../models/gitPlatform';
import {GITHUB} from '../supportedGitPlatforms';
import {GitPlatformService} from '../../services/gitPlatformService';
import {createHash} from 'crypto';

const ACCEPT = `application/vnd.github+json`;
const GITHUB_URL = `https://api.github.com`;
const gitPlatformService = new GitPlatformService();

export const createGithubRepository = async (projectEntity: ProjectEntity) => {
    const email = projectEntity.owner_email;
    const gitPlatformEntity: GitPlatformEntity = await gitPlatformService.getGitPlatform(email, GITHUB);
    if (gitPlatformEntity.personal_access_token.length === 0) {
        throw new Error(`personal access token for ${email} is empty`);
    }

    const githubClient = axios.create({
        baseURL: GITHUB_URL,
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${gitPlatformEntity.personal_access_token}`,
        }
    });

    return await githubClient.post('/user/repos', {
        name: projectEntity.repository_name,
        repository: projectEntity.repository_name + ' created by compage',
        private: !projectEntity.is_repository_public,
    });
};

export const createGithubRepositoryBranch = async (projectEntity: ProjectEntity) => {
    const email = projectEntity.owner_email;
    const gitPlatformEntity: GitPlatformEntity = await gitPlatformService.getGitPlatform(email, GITHUB);
    if (gitPlatformEntity.personal_access_token.length === 0) {
        throw new Error(`personal access token for ${email} is empty`);
    }

    const githubClient = axios.create({
        baseURL: GITHUB_URL,
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${gitPlatformEntity.personal_access_token}`,
        }
    });

    return await githubClient.post(`/repos/${projectEntity.git_platform_user_name}/${projectEntity.repository_name}/git/refs`, {
        ref: `refs/heads/main`,
        sha: createHash('sha1').update('main').digest('hex')
    });
};