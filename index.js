const axios = require('axios');

exports.notify = async () => {
  const { SESSION_COOKIE, LEADERBOARD_ID, WEBHOOK_URL } = process.env;
  const response = await axios({
    method: 'post',
    url: `https://adventofcode.com/2020/leaderboard/private/view/${LEADERBOARD_ID}.json`,
    headers: {
      Cookie: `session=${SESSION_COOKIE};`,
    },
  });

  const message = Object.values(response.data.members)
    .sort((a, b) => {
      if (a.stars === b.stars) {
        return b.local_score - a.local_score;
      }
      return b.stars - a.stars;
    })
    .map((member) => `${member.name} ⭐️${member.stars} 🎮${member.local_score}`)
    .join('\n');

  await axios.post(WEBHOOK_URL, {
    text: message,
  });
};
