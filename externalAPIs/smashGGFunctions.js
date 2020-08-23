const { smashGGToken } = require('../config.json');
const fetch = require("node-fetch");
const smashGGApiVersion = 'alpha';
/*
const schema = buildSchema(
    `
    type Query {
        # Returns the authenticated user
        currentUser: User
        # Returns an event given its id or slug
        #
        # Arguments
        # id: [Not documented]
        # slug: [Not documented]
        event(id: ID, slug: String): Event
        # Returns a league given its id or slug
        #
        # Arguments
        # id: [Not documented]
        # slug: [Not documented]
        league(id: ID, slug: String): League
        # Returns a participant given its id
        #
        # Arguments
        # id: [Not documented]
        # isAdmin: [Not documented]
        participant(id: ID!, isAdmin: Boolean): Participant
        # Returns a phase given its id
        #
        # Arguments
        # id: [Not documented]
        phase(id: ID): Phase
        # Returns a phase group given its id
        #
        # Arguments
        # id: [Not documented]
        phaseGroup(id: ID): PhaseGroup
        # Returns a player given an id
        #
        # Arguments
        # id: [Not documented]
        player(id: ID!): Player
        # Returns a phase seed given its id
        #
        # Arguments
        # id: [Not documented]
        seed(id: ID): Seed
        # Returns a set given its id
        #
        # Arguments
        # id: [Not documented]
        set(id: ID!): Set
        # A shop entity
        #
        # Arguments
        # id: [Not documented]
        # slug: [Not documented]
        shop(id: ID, slug: String): Shop
        # Returns an stream given its id
        #
        # Arguments
        # id: [Not documented]
        stream(id: ID!): Streams
        # Returns all the stream queues for a given tournament
        #
        # Arguments
        # tournamentId: [Not documented]
        # includePlayerStreams: [Not documented]
        streamQueue(tournamentId: ID!, includePlayerStreams: Boolean): [StreamQueueInfo]
        # Returns a tournament given its id or slug
        #
        # Arguments
        # id: [Not documented]
        # slug: [Not documented]
        tournament(id: ID, slug: String): Tournament
        # Paginated, filterable list of tournaments
        #
        # Arguments
        # query: [Not documented]
        tournaments(query: TournamentQuery!): TournamentConnection
        # Returns a user given a user slug of the form user/abc123, or id
        #
        # Arguments
        # id: [Not documented]
        # slug: [Not documented]
        user(id: ID, slug: String): User
        # Returns a videogame given its id
        #
        # Arguments
        # id: [Not documented]
        videogame(id: ID): Videogame
        # Returns paginated list of videogames matching the search criteria.
        #
        # Arguments
        # query: [Not documented]
        videogames(query: VideogameQuery!): VideogameConnection
        }
  `
);
*/
const newestTournamentsQuery = `query SmashTournamentsInUS {
    tournaments(query: {
      perPage: 10
      page: 1
      sortBy: "startAt desc"
      filter: {
        countryCode: "US"
        past: true
        videogameIds: [ 4 ]
      }
    }) {
      nodes {
        id
        name
        slug
      }
    }
  }`;

  const tournamentsQuery = `query SmashTournamentsInUS($perPage: Int!, $cCode: String!, $videogameId: ID!) {
    tournaments(query: {
      perPage: $perPage
      page: 1
      sortBy: "startAt asc"
      filter: {
        countryCode: $cCode
        past: false
        videogameIds: [
          $videogameId
        ]
      }
    }) {
      nodes {
        id
        name
        slug
      }
    }
  }`;

 const getNewestTournamentsQuery = `
  {
    "cCode": "US",
    "perPage": 10,
    "videogameId": 4
  }`

  GetTourniesByFilter = (isOnline) => {
      online = isOnline == null ? true : isOnline;
      const settings = {
        "cCode": "US",
        "perPage": 10,
        "videogameId": 4 //Smash
      };
      settings.hasOnlineEvents = online;
      return settings;
  }

  /*
    hasOnlineEvents
    isOnline
    isRegistrationOpen
  */
 getSettings = (methodType, queryString) => {
    const actualQuery = queryString == null ? newestTournamentsQuery : queryString;
    const settings = {
        method: methodType,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${smashGGToken}`
        }
    }
    if(methodType == "POST"){        
        if(queryString == null) {
            queryString = actualQuery
        }
        settings.body = JSON.stringify({
            'query': queryString 
        });
        settings.headers["Content-Type"] = 'application/json';        
    }    
    if(methodType == "GET") {
        //
    }
    return settings;
}

getPostSettings = (queryString) => {
    return getSettings("POST", queryString);
}
module.exports = {
    GetTournaments: GetTournaments = () => {
        return new Promise((resolve, reject) => {
            const url = `https://api.smash.gg/gql/${smashGGApiVersion}`;
            fetch(url, getPostSettings(newestTournamentsQuery))
                .then(res => res.json())
                .then((json) => {
                    console.log('the api call worked! heres the response from smash gg api')
                    console.log(json)
                    if(json.errors != null && json.errors.length != 0){
                        reject(`found errors, first errorId is ${json.errors[0].errorId}`);
                        return;
                    }
                    const tournies = json.data.tournaments.nodes;
                    console.log(`found ${tournies.length} tournies`)
                    console.log(tournies)
                    resolve()
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        });
    },
}