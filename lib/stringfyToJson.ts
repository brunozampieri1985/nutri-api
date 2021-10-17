
const stringfyToJson = (input: any) => {
    let stringfy = JSON.stringify(input)
    let output = JSON.parse(stringfy)
    return output
}

export default stringfyToJson