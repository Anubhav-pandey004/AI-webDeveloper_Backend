const {createClient} =require('pexels');

const client = createClient(process.env.PEXELS_API_TOKEN);
const query = 'Nature';
module.exports = Pexels=()=>{
    client.photos.search({ query, per_page: 1 }).then(photos => {

    });
}
