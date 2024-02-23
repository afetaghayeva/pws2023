export default {
    methods: {
        checkIfInRole(user, roleNums) {
            let intersection = []
            if(roleNums == null) {
                intersection.push(-1)
            } else {
                roleNums.forEach((roleNum) => {
                    if(user.roles && user.roles.includes(roleNum)) {
                        intersection.push(roleNum)
                    }
                })
            }
            return intersection.length > 0
        },
        defaultCoords() {
            return { lat: 51.776792410651765, lng: 19.48687875188774 }
        },
        defaultColor() {
            return '#1F0080'
        }
    }
}