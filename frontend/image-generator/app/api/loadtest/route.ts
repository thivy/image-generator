export async function GET(request: Request) {
  // const prompts = [
  //   "a cat",
  //   "a cat playing with a ball",
  //   "a dog and an elephant going for a walk",
  //   "a bird singing on a tree",
  //   "a fish swimming in a tank",
  //   "a rabbit hopping in a garden",
  //   "a lion roaring in the jungle",
  //   "a tiger chasing a deer",
  //   "a monkey swinging from a branch",
  //   "a kangaroo jumping over a fence",
  //   "a dolphin jumping out of the water",
  //   "a bear catching a fish",
  //   "a horse running in a meadow",
  //   "a peacock spreading its feathers",
  //   "a giraffe eating leaves from a tall tree",
  //   "a panda eating bamboo",
  //   "a penguin sliding on ice",
  //   "a flamingo standing on one leg",
  //   "a turtle crawling on the beach",
  //   "a butterfly fluttering in the garden",
  //   "a parrot talking in a cage",
  //   "a squirrel gathering nuts",
  //   "a snake slithering through the grass",
  //   "a crocodile basking in the sun",
  //   "a bee buzzing around flowers",
  //   "a duck swimming in a pond",
  //   "a deer drinking water from a stream",
  //   "an owl hooting at night",
  //   "a sheep grazing in a field",
  //   "a cow chewing cud in a pasture",
  //   "a rooster crowing at dawn",
  //   "a hedgehog rolling into a ball",
  //   "a chameleon changing colors",
  //   "a ladybug crawling on a leaf",
  //   "a goldfish swimming in a bowl",
  //   "a seahorse floating in the sea",
  //   "a fox sneaking through the woods",
  //   "a bat hanging upside down",
  //   "a llama walking through the mountains",
  //   "a camel crossing the desert",
  //   "a hippo yawning in the water",
  //   "a rhino charging through the savanna",
  //   "a whale spouting water",
  //   "a shark circling its prey",
  //   "a lobster snapping its claws",
  //   "an octopus hiding in a rock",
  //   "a starfish clinging to a reef",
  //   "a crab scuttling on the shore",
  //   "a jellyfish drifting in the ocean",
  //   "a walrus lounging on the ice",
  //   "a wolf howling at the moon",
  //   "a falcon soaring in the sky",
  //   "an eagle diving for fish",
  //   "an antelope leaping across the plains",
  //   "a cheetah sprinting after a gazelle",
  //   "a leopard resting in a tree",
  //   "a hyena laughing in the grasslands",
  //   "a meerkat standing guard",
  //   "a warthog rooting in the dirt",
  //   "a porcupine bristling its quills",
  //   "a lemur climbing a tree",
  //   "a platypus swimming in a stream",
  //   "a beaver building a dam",
  //   "a moose wading in a lake",
  //   "a raccoon rummaging through trash",
  //   "a skunk raising its tail",
  //   "a weasel darting through the underbrush",
  //   "an armadillo curling into a ball",
  //   "a koala sleeping in a eucalyptus tree",
  //   "a sloth hanging from a branch",
  //   "an anteater sniffing for ants",
  //   "a tarantula crawling in the desert",
  //   "a scorpion hiding under a rock",
  //   "a gecko climbing a wall",
  //   "a dragonfly hovering over a pond",
  //   "a moth flying around a light",
  //   "a hummingbird sipping nectar",
  //   "a sparrow building a nest",
  //   "a robin pulling a worm from the ground",
  //   "a crow picking at roadkill",
  //   "a stork delivering a baby",
  //   "a pelican catching fish in its beak",
  //   "a heron standing in a river",
  //   "a flamingo wading in a lagoon",
  //   "a toucan sitting in the rainforest",
  //   "a macaw flying through the canopy",
  //   "a woodpecker pecking at a tree",
  //   "a kiwi foraging at night",
  //   "an emu running across the outback",
  //   "a cassowary stalking through the jungle",
  //   "a vulture circling overhead",
  //   "an albatross gliding over the ocean",
  //   "a hawk watching from a cliff",
  //   "a swan gliding on a lake",
  //   "a pigeon pecking at crumbs",
  //   "a goose honking in a field",
  //   "a turkey strutting its feathers",
  //   "a quail scurrying in the underbrush",
  //   "a dove cooing on a branch",
  //   "a flamingo and a parrot having a conversation",
  //   "a kangaroo boxing with another kangaroo",
  // ];

  // let promises: Array<Promise<InputState>> = [];

  // prompts.slice(0, 5).map((prompt) => {
  //   const formData = new FormData();
  //   formData.append("prompt", prompt);
  //   const promise = generateImage(
  //     {
  //       error: "",
  //       id: "",
  //     },
  //     formData
  //   );

  //   promises.push(promise);
  // });

  // await Promise.all(promises);
  await fetchData();
  return Response.json({
    message: "Hello from the image-generator API!",
  });
}

async function fetchData() {
  let page = 1;
  let isValidRequest = true;

  while (isValidRequest) {
    try {
      const response = await fetch(
        "https://api-r3.tagalys.com/v1/mpages/_platform/271553691782",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request: ["total", "details"],
            page: page,
            per_page: 100,
            product_listing_page_id: 262012141702,
            identification: {
              client_code: "FAA9741EF5AE9305",
              api_key: "806bd0e6ebcd0bbbdca9e7eb6e6136e8",
              store_id: 2315124788,
              currency: "AUD",
              api_client: {
                vendor: "tagalys-ui-widgets",
                language: "js",
                version: "2.0.0-beta1",
              },
            },
          }),
        }
      );

      if (!response.ok) {
        isValidRequest = false;
        console.log(page);
        console.error("Invalid request:", response.statusText);
        break;
      }

      const data = await response.json();
      console.log(data);

      // Increment the page number for the next request
      page++;
    } catch (error) {
      console.error("Error:", error);
      isValidRequest = false;
    }
  }
}

fetchData();
