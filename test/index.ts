import typia from "typia";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

function test() {
  const result = typia.stringify({} as User);
  console.log(result);
}
