import axios from "axios"

const instance = axios.create({
    baseURL: 'https://ca8050220545a78d.mokky.dev'
})
export const statusApi = {
    getItems() {
        return instance.get(`status`)
    }
}
export const authApi = {
    createUser(data) {
        return instance.post('register', data)
    },
    auth(email,password) {
        return instance.post('auth', {email, password})
    }, 
    disableUser(email) {
        //
    },
    authMe(token) {
        return instance.get('auth_me', {
            headers: { 
                Authorization: 'Bearer ' + token
            }
        })
    },
    forgotPassword(email) {
        //
    },
    recoveryPassword(email, password) {
        //
    },
    emailVerify(email) {
        //
    },
    changePassword(userId, data) {
        return instance.patch('users/' + userId, data)
    }
}
export const projectsApi = {
    getPath(role, userId, allProjects = false) {
        let path
        switch (role) {
            case 'user':
                /*    path = 'user-projects /' + userId + (allProjects ? '?_select=id,imageURL,title,status' : '') */
                path = 'user-projects' + (allProjects ? '?_select=id,imageURL,title,status,deadline' : '')
                break
            case 'expert':
                path = 'experts-projects' + (allProjects ? '?_select=id,imageURL,title,wave,direction,point' : '')
                break
            case 'expertSpecComp':
                path = 'spec-experts-projects' + (allProjects ? '?_select=id,imageURL,title,wave,direction,point' : '')
                break
            case 'workingGroup': 
                path = 'wg-projects' + (allProjects ? '?_select=id,imageURL,title' : '')
                break
            default: 
                path = 'manager-projects' + (allProjects ? '?_select=id,imageURL,title,wave,point,status' : '')
                break
        }
        return path
    },
    getYears() {
        return instance.get('projects-years?sortBy=-id')
    },
    getItems(role, userId, params) {
        let path = this.getPath(role, userId, true)
        return instance.get(path, { params })
    },
    getItem(role, userId, id) {
        let path = this.getPath(role, userId)
        return instance.get(path + '/' + id)
    },
    postItem(data, role, userId) {
        /* return instance.post('projects', data) */
        let path = this.getPath(role, userId)// удалить
        return instance.post(path, data) //удалить
    },
    editItem(id, data, role = false, userId = false) {
        /* return instance.patch('projects/' + id, data) */
        if (role && userId) {
            let path = this.getPath(role, userId)//удалить
            return instance.patch(path + '/' + id, data)//удалить
        } else {
            return instance.patch('projects/' + id, data)
        }
    },
    delItem(id, role, userId) {
        /* return instance.delete('projects/' + id) */
        let path = this.getPath(role, userId)//удалить
        return instance.delete(path + id)//удалить
    },
}
export const registerApi = {
    getItems(params) {
        return instance.get('register-data', { params })
    },
    editComment(id, data) {
        /* return instance.patch('projects/' + id, data) */
        return instance.patch('register-data/' + id, data)//удалить
    },
}
export const ratingApi = {
    getItems(projectId) {
        /*return instance.get(`rating/${projectId}`)*/
        return instance.get('rating')
    },
    getItem(projectId, expertId) {
        /*return instance.get(`rating/${projectId}?expertId=${expertId}`)*/
        return instance.get('rating?expertId=' + expertId)
    },
    postItem(projectId, data) {
        /*return instance.post(`rating/${projectId}`, data)*/
        return instance.post('rating', data)
    },
    editItem(projectId, id, data) {
        /* return instance.patch(`rating/${projectId}/${id}`, data) */
        return instance.patch('rating/' + id, data)
    },
}
export const ratingArchiveApi = {
    getItems(projectId) {
        /*return instance.get(`rating-archive/${projectId}`)*/
        return instance.get('rating-archive')
    },
    getItem(projectId, expertId) {
        /*return instance.get(`rating-archive/${projectId}?expertId=${expertId}`)*/
        return instance.get('rating-archive?expertId=' + expertId)
    },
    postItem(projectId, data) {
        /*return instance.post(`rating-archive/${projectId}`, data)*/
        return instance.post('rating-archive', data)
    },
    editItem(projectId, id, data) {
        /* return instance.patch(`rating-archive/${projectId}/${id}`, data) */
        return instance.patch('rating-archive/' + id, data)
    },
}
export const messagesApi = {
    getItems(userId,projectId) {
        return instance.get('messages')
    },
    postItem(userId, projectId, data) {
        return instance.post('messages', data)
    },
    editItem(userId, projectId, id, data) {
        return instance.patch('messages/' + id, data)
    },
}
export const notificationsApi = {
    getItems(userId, params) {
        return instance.get('notifications', { params })
    },
    editItem(userId, id, data) {
        return instance.patch('notifications/' + id, data)
    },
}
export const docsVideoApi = {
    getItems() {
        return instance.get('docs-video?sortBy=orderId')
    },
    delItem(id) {
        return instance.delete('docs-video/' + id)
    },
    postItem(data, signal) {
        return instance.post('docs-video', data, { signal } )
    },
    sort(id, data) {
        return instance.patch('docs-video/' + id, data)
    },
}
export const docsApi = {
    getItems() {
        return instance.get(`docs?sortBy=orderId`)
    },
    delItem(id) {
    return instance.delete('docs/' + id)
    },
    postItem(data, signal) {
        return instance.post('docs', data, { signal } )
    },
    sort(id, data) {
        return instance.patch('docs/' + id, data)
    },
}
export const wavesApi = {
    getItems() {
        return instance.get(`waves?sortBy=-id`)
    },
    delItem(id) {
        return instance.delete('waves/' + id)
    },
    postItem(data) {
        return instance.post('waves', data)
    },
    editItem(id, data) {
        return instance.patch('waves/' + id, data)
    }
}