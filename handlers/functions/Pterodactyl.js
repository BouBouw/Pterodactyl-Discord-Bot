const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY;
const PTERODACTYL_URL = process.env.PTERODACTYL_URL;

async function GetUser(email) {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API Pterodactyl : ${JSON.stringify(error)}`);
    }

    const userData = await response.json();
    if (userData.data.length === 0) {
        throw new Error("Aucun utilisateur trouvé avec cette adresse e-mail.");
    }

    return userData.data[0]
}

async function CreateUser(username, email, first_name, last_name, password)  {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/users`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            first_name,
            last_name,
            password
        })
    });

    if(!response.ok) {
        const error = await response.json();
        throw new Error("Erreur API Pterodactyl :", error)
    }

    return response.json();
}

async function ManageUser(user_id, username, email, first_name, last_name) {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/users/${user_id}`, {
        method: "PATCH",
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            first_name,
            last_name,
        })
    })

    if(!response.ok) {
        const error = await response.json();
        throw new Error("Erreur API Pterodactyl :", error)
    }

    return response.json();
}

async function DeleteUser(user_id) {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/users/${user_id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur API Pterodactyl : ${errorData.errors ? errorData.errors[0].detail : 'Unknown error'}`);
    }

    return { success: true, message: "Utilisateur supprimé avec succès." };
}

async function GetServers() {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API Pterodactyl : ${JSON.stringify(error)}`);
    }

    const serversData = await response.json();
    return serversData.data;
}

async function CreateServer(email, egg, name) {
    const eggInt = parseInt(egg, 10);
    const user = await GetUser(email);

    const container = {
        startup: {
            15: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/{{BOT_JS_FILE}}',
            16: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z {{PY_PACKAGES}} ]]; then pip install -U --prefix .local {{PY_PACKAGES}}; fi; if [[ -f /home/container/${REQUIREMENTS_FILE} ]]; then pip install -U --prefix .local -r ${REQUIREMENTS_FILE}; fi; /usr/local/bin/python /home/container/{{PY_FILE}}'
        },
        docker_image: {
            15: "ghcr.io/parkervcp/yolks:nodejs_18",
            16: "ghcr.io/parkervcp/yolks:python_3.10"
        }
    }

    const serverData = {
        name: name,
        user: user.attributes.id,
        egg: eggInt,
        docker_image: container.docker_image[eggInt],
        startup: container.startup[eggInt],
        environment: {
            MAIN_FILE: "index.js",
            BUNGEE_VERSION: "latest",
            SERVER_JARFILE: "server.jar",
            USER_UPLOAD: "0",
            AUTO_UPDATE: "0",
            PY_FILE: "app.py",
            JS_FILE: "index.js",
            BOT_JS_FILE: "index.js",
            REQUIREMENTS_FILE: "requirements.txt"
        },
        limits: {
            memory: 512,
            swap: 0,
            disk: 1024,
            io: 500,
            cpu: 50
        },
        feature_limits: {
            databases: 0,
            backups: 2,
            allocations: 2
        },
        deploy: {
            locations: [1], // Remplacez par l'ID de l'emplacement souhaité
            dedicated_ip: false,
            port_range: []
        }
    };

    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(serverData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API Pterodactyl : ${JSON.stringify(error)}`);
    }

    return response.data;
}

async function DeleteServer(server_id) {
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers/${server_id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur API Pterodactyl : ${errorData.errors ? errorData.errors[0].detail : 'Unknown error'}`);
    }

    return { success: true, message: "Serveur supprimé avec succès." };
} 


const Pterodactyl = {
    GetUser,
    CreateUser,
    ManageUser,
    DeleteUser,
    GetServers,
    CreateServer,
    DeleteServer
};

module.exports = Pterodactyl;