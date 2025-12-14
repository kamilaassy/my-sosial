// import { Textarea, useMantineTheme, useMantineColorScheme } from '@mantine/core'

// import { Button } from './Button'
// import { GlassCard } from './GlassCard'

// export const PostForm = ({ onSubmit }) => {
//   const theme = useMantineTheme()
//   const { colorScheme } = useMantineColorScheme()
//   const isDark = colorScheme === 'dark'

//   const inputBg = isDark ? 'rgba(8,8,12,0.32)' : 'rgba(255,255,255,0.18)'

//   const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'

//   const textColor = isDark
//     ? theme.colors.purplelux[0]
//     : theme.colors.purplelux[9]

//   const placeholderColor = isDark
//     ? 'rgba(8,8,12,0.32)'
//     : 'rgba(255,255,255,0.18)'

//   return (
//     <GlassCard padding="lg" mb="lg">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           onSubmit(e)
//         }}
//       >
//         <Textarea
//           placeholder="What's on your mind?"
//           autosize
//           minRows={2}
//           mb="md"
//           radius="md"
//           styles={{
//             input: {
//               background: inputBg,
//               backdropFilter: 'blur(10px)',
//               border: `1px solid ${inputBorder}`,
//               color: textColor,
//               fontSize: 14,
//               lineHeight: 1.6,

//               '::placeholder': {
//                 color: placeholderColor,
//               },

//               '&:focus': {
//                 borderColor: theme.colors.purplelux[4],
//               },
//             },
//           }}
//         />

//         <Button type="submit" radius="xl">
//           Post
//         </Button>
//       </form>
//     </GlassCard>
//   )
// }
