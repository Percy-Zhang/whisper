export const formatId = id => {
    let formattedId = '' + id
    let numLeadingZeroes = 10 - formattedId.length
    while (numLeadingZeroes > 0) {
        formattedId = '0' + formattedId
        numLeadingZeroes -= 1
    }
    return formattedId
}