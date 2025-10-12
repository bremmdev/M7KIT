import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageScrollIndicator } from "./PageScrollIndicator";

/**
 * The `PageScrollIndicator` component is used to display a progress indicator for the current scroll position on the page and can be used to show the
 * user how far they have scrolled through the page.
 *
 * ## Features
 * - Supports custom styles by passing a className
 *
 * ## Usage
 * ```
 *  <PageScrollIndicator
 *    className="bg-blue-500 rounded-full h-2"
 *  />
 * ```
 */

const meta: Meta<typeof PageScrollIndicator> = {
  component: PageScrollIndicator,
  title: "Components/PageScrollIndicator",
  tags: ["autodocs"],
};

const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
sollicitudin rutrum dolor et mattis. Proin lobortis ex quis risus
tincidunt viverra. Suspendisse fringilla lorem sed maximus condimentum.
Morbi in vulputate dolor. Cras sit amet sodales lectus. Nullam congue
tortor sit amet nisi maximus, in fringilla enim dapibus. Cras quis
tortor mollis, dictum nisi sit amet, dignissim lorem. Integer sagittis
lectus orci, id facilisis leo fringilla ut. Quisque id nibh finibus,
interdum leo a, interdum eros. Nulla vestibulum malesuada massa, in
molestie orci rhoncus eget. Ut viverra ligula libero, at dignissim arcu
condimentum a. Praesent scelerisque dapibus dolor, nec feugiat ex
vulputate in. Aenean placerat venenatis malesuada. Donec finibus, augue
eu fringilla imperdiet, nunc ante blandit massa, ac hendrerit justo
massa ac quam. Cras accumsan dapibus turpis a semper. Etiam sit amet
auctor enim, a eleifend dui. Maecenas euismod felis eu diam molestie
ullamcorper. Duis venenatis lorem non velit imperdiet, eget molestie
diam pretium. Donec efficitur nisl quis congue interdum. Suspendisse
potenti. Nullam vulputate nibh nec finibus placerat. Donec facilisis
sagittis facilisis. Ut suscipit commodo tellus, in sodales nisi rhoncus
a. Vestibulum nec lorem sit amet libero facilisis congue vel a dolor.
Suspendisse porttitor, velit in pharetra aliquet, tellus odio mollis
eros, eu eleifend metus tortor tincidunt dolor. Integer mollis vitae
nunc a feugiat. Proin viverra sapien ante, in rutrum nunc placerat
mollis. Duis semper erat sed arcu efficitur, sit amet rhoncus risus
volutpat. Integer consectetur, ligula nec posuere porttitor, tellus
turpis luctus est, lacinia tincidunt sem ante id nunc. Fusce at nibh
arcu. Suspendisse potenti. Suspendisse at placerat sem. Morbi semper,
mauris non facilisis lacinia, nisl diam interdum dui, id imperdiet nulla
tellus ac ante. Vestibulum eu suscipit magna. Quisque condimentum nulla
sem, ut dignissim purus dapibus vel. Fusce in sem dignissim, porttitor
eros ullamcorper, accumsan mi. Sed augue magna, consequat ac lacinia
iaculis, tristique eget ligula. Phasellus eu faucibus risus. Donec
malesuada aliquam semper. Sed laoreet mollis laoreet. Integer eget
tempus nulla. Fusce et arcu eu odio sodales aliquam in id magna.
Maecenas non purus porta, semper dolor et, scelerisque nulla. Duis
pharetra, mi quis fringilla mollis, erat lectus tempor magna, ut
porttitor mauris elit in nulla. Maecenas hendrerit luctus diam, et
mollis enim pharetra ac. Phasellus consectetur vestibulum nunc quis
placerat. Fusce vel ornare eros, in fringilla sapien. Cras commodo velit
et pharetra condimentum. Donec tincidunt ipsum non erat commodo
vestibulum. Praesent luctus in neque blandit elementum. Nulla pulvinar
enim vel ultricies pulvinar. Proin iaculis ultrices cursus. Donec nec
neque sollicitudin, accumsan lectus imperdiet, pretium leo. In consequat
placerat orci, vitae lobortis mauris ultricies eu. Curabitur ornare nunc
non varius vehicula. Donec vehicula, risus nec faucibus scelerisque,
nibh erat ornare augue, a egestas lacus sem quis diam. Proin fringilla
risus at mi dignissim sodales. Aenean eu libero non diam blandit
volutpat. Sed suscipit elit sit amet neque porttitor aliquam. Sed
commodo blandit eros, at efficitur nulla pulvinar sed. Sed eleifend
lacus nulla, et tincidunt risus pretium vitae. Morbi nec quam volutpat,
tristique enim ut, auctor metus. Aliquam posuere interdum venenatis.
Cras lobortis laoreet odio, a auctor nulla mattis ac. Aliquam varius
ipsum tellus, at blandit ipsum placerat sed. Proin ullamcorper egestas
ex, a cursus massa feugiat vel. Integer a lorem id ante faucibus rutrum.
Suspendisse a interdum ante, at varius lectus. Nullam eget semper arcu,
laoreet ornare risus. Pellentesque ultricies ex nec tellus gravida, sit
amet lobortis orci convallis. Pellentesque habitant morbi tristique
senectus et netus et malesuada fames ac turpis egestas. Praesent at
dolor purus. Vestibulum mattis vulputate nisi at iaculis. Aliquam
vehicula elit sed nulla ultrices fermentum. Vestibulum malesuada
fermentum rhoncus. Morbi posuere et lectus sit amet dictum. Vestibulum
rutrum vitae dolor ut tristique. Quisque ultricies fermentum interdum.
Maecenas facilisis elementum interdum. Praesent viverra, ante non
posuere eleifend, lorem ipsum pellentesque libero, vitae facilisis ex
est non leo. Nulla nec nisl eget neque scelerisque gravida id eget
felis. Ut finibus dictum velit. Quisque malesuada placerat odio nec
maximus. Aenean consectetur efficitur neque, sit amet euismod nulla
fringilla gravida. Class aptent taciti sociosqu ad litora torquent per
conubia nostra, per inceptos himenaeos. Suspendisse facilisis velit
vitae posuere ultricies. Ut pharetra, sapien nec lobortis rhoncus, ipsum
urna venenatis elit, id congue eros felis vel urna. In maximus eu mauris
non porta. Pellentesque viverra quam ex, id eleifend est mollis sodales.
Vivamus vehicula, metus vel bibendum facilisis, lacus ante pellentesque
tellus, nec finibus neque leo ut ligula. In hac habitasse platea
dictumst. Sed aliquam feugiat vulputate. Vestibulum rhoncus dictum
tincidunt. Duis vel egestas dolor. Quisque in sem eu metus posuere
malesuada vel condimentum orci. Suspendisse vel libero hendrerit,
euismod odio non, consectetur lorem. In justo sem, viverra ornare dictum
vitae, feugiat vel metus. Phasellus finibus condimentum nunc, sit amet
ornare dolor feugiat sit amet. Phasellus cursus nibh urna, eget cursus
mi vulputate eget. Aenean vel sodales tellus, quis sodales dolor. Morbi
congue finibus felis, lobortis mattis libero ultrices sed. Phasellus
iaculis blandit quam a ullamcorper. Aliquam ornare, risus nec finibus
suscipit, sem ante tincidunt tellus, quis elementum nibh ipsum a ligula.
Interdum et malesuada fames ac ante ipsum primis in faucibus.
Pellentesque laoreet dui iaculis ipsum consectetur, sit amet efficitur
arcu pellentesque. In volutpat fermentum luctus. Nunc eu hendrerit
purus. In lectus tortor, lacinia id augue quis, tristique suscipit
turpis. Fusce a urna quis massa vulputate sagittis. Vivamus ut enim
risus. Mauris consequat eu diam non gravida. Vestibulum ante ipsum
primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin
luctus laoreet feugiat. Fusce a nunc faucibus, suscipit est eu, varius
ipsum. Aenean sit amet convallis ligula, sit amet facilisis est.
Vestibulum dapibus, ipsum nec lacinia fermentum, nibh augue ornare est,
ac lacinia purus purus vel diam. Aenean lobortis nulla sit amet tellus
scelerisque auctor. Cras imperdiet, tellus id aliquet euismod, ex sem
volutpat risus, vel interdum lacus nunc vitae magna. In eget neque
sagittis, pulvinar quam nec, posuere purus. Duis facilisis lorem nec
quam dictum tristique id ut nibh. Sed ac diam suscipit, tristique lacus
vel, cursus mauris. Vestibulum finibus luctus tincidunt. Nunc aliquam
ante eget nisi placerat, at convallis est facilisis. Ut nulla nibh,
porta nec mi ac, fermentum posuere orci. Donec ut gravida enim, id
placerat odio. Donec mollis est sed turpis tincidunt ullamcorper. Morbi
eu congue nisl. Nulla efficitur eros sit amet felis sagittis, ut
efficitur lorem laoreet. Curabitur tempus eros vitae venenatis viverra.
Fusce suscipit commodo aliquet. Donec scelerisque lacinia diam a
gravida. Duis faucibus, arcu eu lobortis sagittis, est lacus condimentum
libero, a accumsan nibh sapien eu tellus. Lorem ipsum dolor sit amet,
consectetur adipiscing elit. Praesent consectetur sem sit amet neque
pretium, ut congue metus venenatis. Pellentesque non eros interdum,
pretium odio nec, lobortis turpis. Donec venenatis ipsum nibh, sit amet
rutrum ante volutpat sed. Mauris felis dui, aliquet non suscipit nec,
ultrices eget ipsum. Integer nec neque vitae dui maximus fringilla.
Aenean finibus nisi sit amet dui sagittis congue. Nunc vel quam lectus.
Quisque fringilla in odio ut luctus. Vestibulum id mauris id nisi dictum
tempor. Vestibulum vulputate ipsum ut tempor fringilla. Etiam orci nisi,
tempus vel maximus sit amet, auctor sed mi. Sed id nibh non enim pretium
gravida. Nullam commodo justo sed leo ultricies placerat. Praesent
accumsan sem ut purus hendrerit tempus. Lorem ipsum dolor sit amet,
consectetur adipiscing elit. Quisque massa augue, mollis ac malesuada
id, pellentesque non lorem. Vivamus faucibus pellentesque risus non
pellentesque. Nunc sed ornare ipsum. Pellentesque ac neque pretium,
laoreet nisl venenatis, mollis ipsum. Aenean id diam sollicitudin,
pellentesque risus id, luctus ex. Phasellus et dignissim erat. Nullam
metus nulla, commodo in sollicitudin a, hendrerit nec dui. Donec
volutpat pulvinar ipsum, non laoreet nibh lacinia molestie. Donec
vehicula ultrices est id consectetur. Nulla rhoncus consectetur nisi, in
consectetur nisl hendrerit vestibulum. Mauris dictum ante in justo
porttitor consectetur. Maecenas feugiat turpis vel congue egestas. Nulla
semper, quam quis ornare ornare, velit urna porta dui, sit amet
condimentum mauris dui vulputate leo. Maecenas suscipit sit amet ex sit
amet dapibus. Nunc rutrum nisl magna, vel facilisis erat commodo et.
Nunc congue lacinia mi eget blandit. In mattis, dolor at dapibus rutrum,
libero sapien dapibus justo, eu cursus tortor dui et dui. Nam vitae
luctus felis. Mauris id laoreet libero. Nunc elementum ipsum id elit
blandit, at hendrerit urna malesuada. Proin libero felis, dapibus id
nisl ut, congue suscipit orci. Nunc ut tortor nibh. Donec ut lorem
consectetur, tincidunt justo sed, hendrerit mauris. Vestibulum blandit
ornare eros ac finibus. Proin eu lectus viverra, aliquet tellus eget,
pulvinar elit. In mattis et velit ac varius. Aliquam ullamcorper
interdum commodo. Quisque non risus quis nisl sagittis dignissim. Donec
lobortis rhoncus elit, in dignissim urna hendrerit tristique. Morbi ac
neque non lacus vulputate sagittis in a risus. Vivamus venenatis
sagittis lorem, sed mattis massa cursus semper. Nulla facilisi.
Suspendisse potenti. Nunc maximus, mauris eu suscipit ultricies, lectus
ex consectetur felis, sit amet rutrum urna nisl et est. Proin ac finibus
dolor. Donec suscipit, metus vitae accumsan lacinia, nibh tellus
tincidunt neque, sit amet scelerisque magna ante quis tortor. Maecenas
tempor tortor vel luctus fringilla. Etiam tincidunt cursus libero, non
pulvinar lorem mattis ac. Nulla a fermentum tortor. Ut in mi eget mauris
iaculis consectetur. Aenean ut scelerisque augue, eget pretium odio.
Pellentesque id augue sagittis, volutpat ligula et, tristique odio.
Aliquam est magna, auctor id leo egestas, hendrerit hendrerit mi. Morbi
vehicula libero et eros convallis, vel tristique ante interdum. Etiam
venenatis dictum erat a gravida. Mauris id ligula vel purus gravida
gravida. Quisque id tincidunt urna. Curabitur vitae luctus enim, vel
egestas urna. Sed rutrum vel dolor ac molestie. Nullam finibus mi nulla,
volutpat malesuada metus accumsan id. Proin congue neque non porttitor
blandit. Cras dictum eros a dolor tempus, non aliquet tellus malesuada.
Praesent justo nisi, semper a tempus ac, elementum vitae sem.
Suspendisse potenti. Cras sagittis augue in nisl auctor dictum. Nulla
dignissim non mi ac pulvinar. Integer ultricies ex nisi, ac convallis
ante tincidunt sed. Cras at luctus nunc. Suspendisse potenti. Fusce eget
leo sagittis, bibendum ex ut, aliquet eros. Nullam nisi velit, aliquam
porta nunc id, cursus fermentum purus. Pellentesque sodales enim luctus
nisl elementum viverra. Sed sagittis, enim vitae tempor tempus, nisl
enim interdum ipsum, in consectetur metus sem non sem. Donec leo dui,
maximus sit amet ligula eu, euismod dignissim nisl. Morbi nisi purus,
pharetra in mi ut, cursus laoreet ligula. Morbi egestas tellus ipsum,
sit amet rutrum dui varius vel.`;

export default meta;

type Story = StoryObj<typeof PageScrollIndicator>;

export const Default: Story = {
  render: (props) => (
    <div className="text-foreground">
      <PageScrollIndicator {...props} />
      <p className="px-8">{content}</p>
    </div>
  ),
};

export const CustomTop: Story = {
  render: (props) => (
    <div className="text-foreground">
      <nav className="fixed top-0 left-0 w-screen text-foreground">
        <ul className="m-0 flex gap-4 justify-center items-center bg-neutral px-4 mb-4 h-12">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Articles</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
        </ul>
      </nav>
      <PageScrollIndicator {...props} className="top-12" />
      <p className="px-8 py-16">{content}</p>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: (props) => (
    <div className="text-foreground">
      <PageScrollIndicator
        className="bg-emerald-400 rounded-full h-2"
        {...props}
      />
      <p className="px-8">{content}</p>
    </div>
  ),
};
