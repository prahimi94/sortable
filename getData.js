export async function getData() {
  const url = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";
  let json  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    json = await response.json();
  } catch (error) {
    console.error(error.message);
  }
  return json
}

let json = getData()
