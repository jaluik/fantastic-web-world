// sebmck === bar; 转换为  left === right

export default function ({types: t}) {
    return {
        visitor: {
            BinaryExpression(path){
                if(path.node.operator !== "==="){
                    return ;
                }
                path.node.left = t.identifier("left")
                path.node.right = t.identifier("right")

            }
        }
    }
}