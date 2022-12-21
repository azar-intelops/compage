import {Repository, User} from "../routes/models";

export interface Resource {
    apiVersion: string,
    kind: string,
    metadata: any,
    spec: any
}

export interface ResourceList {
    apiVersion: string,
    kind: string,
    metadata: any,
    items: Resource[]
}

export interface ProjectResource {
    apiVersion: string,
    kind: string,
    metadata: ProjectMetadata,
    spec: ProjectResourceSpec
}

export interface UserResource {
    apiVersion: string,
    kind: string,
    metadata: UserMetadata,
    spec: UserResourceSpec
}

export interface UserMetadata {
    name: string,
    namespace: string,
}

export interface ProjectMetadata {
    name: string,
    namespace: string,
    labels: {
        userName: string
    }
}

export interface UserResourceSpec {
    email: string,
    token: string,
}

export interface ProjectResourceSpec {
    id: string,
    displayName: string,
    user: User,
    yaml: string,
    repository: Repository,
    metadata: string
    version: string,
}

export interface ProjectResourceStatus {
    version: string,
    isGenerated: string
}

export interface ProjectResourceList {
    apiVersion: string,
    kind: string,
    metadata: string,
    items: ProjectResource[]
}

export interface UserResourceList {
    apiVersion: string,
    kind: string,
    metadata: string,
    items: UserResource[]
}

// user
export const user_group = "compage.kube-tarian.github.com";
export const user_version = "v1alpha1";
export const user_plural = "users";
export const user_kind = "User"

// project
export const project_group = "compage.kube-tarian.github.com";
export const project_version = "v1alpha1";
export const project_plural = "projects";
export const project_kind = "Project"
