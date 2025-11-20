import React from "react"

const IconCell = React.memo(function IconCell({ Icon }: { Icon: React.ElementType }) {
  return (
    <span className="h-10 w-10 flex items-center justify-center ml-[-0.01rem]">
      <Icon className="h-5 w-5" />
    </span>
  )
})

export default IconCell