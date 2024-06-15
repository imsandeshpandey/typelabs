import { PaintbrushIcon, SettingsIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { FontFamilyIcon, KeyboardIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent } from '../ui/tabs'
import { FontSelect } from './font-select/font-select'
import { ReactNode, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { SoundPackItem } from './sound-pack-item'
import { sounds } from '@/config/keyboard-soundpacks.config'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { KEYBINDS } from '@/config/keybinds.config'
import { useHotkeys } from 'react-hotkeys-hook'
import { ThemeSwitcher } from './theme-switcher'
const TABS = ['Fonts', 'Soundpack', 'Theme']

const TabButton = (props: {
  icon: ReactNode
  label: string
  tabIndex: number
  currentTab: string
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <Button
      onClick={() => props.setCurrentTab(TABS[props.tabIndex])}
      variant="ghost"
      className={cn(
        'justify-normal text-muted-foreground hover:text-accent-foreground gap-2 hover:bg-muted',
        {
          'bg-muted text-foreground': props.currentTab === TABS[props.tabIndex],
        }
      )}
    >
      {props.icon}
      {props.label}
    </Button>
  )
}

export const SettingsDialog = () => {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null)
  const [currentTab, setCurrentTab] = useState(TABS[0])

  useHotkeys(KEYBINDS.SETTINGS.hotkey, () => {
    dialogTriggerRef.current?.click()
  })

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              ref={dialogTriggerRef}
              variant="ghost"
              className="gap-2 group p-2"
            >
              <SettingsIcon className="h-5 transition-all text-muted-foreground group-hover:text-accent-foreground group-hover:animate-spinOnce" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="flex gap-1 border-foreground/20 items-center text-xs">
          {KEYBINDS.SETTINGS.label}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="w-full flex h-3/4 max-w-5xl overflow-hidden">
        <div className="max-h-full w-fit">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="flex flex-col gap-2 w-[12rem] ">
            <TabButton
              tabIndex={0}
              label="Font"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              icon={
                <FontFamilyIcon className="border border-foreground/10 rounded-sm" />
              }
            />
            <TabButton
              tabIndex={1}
              label="Soundpack"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              icon={<KeyboardIcon />}
            />
            <TabButton
              tabIndex={2}
              label="Theme"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              icon={<PaintbrushIcon className="h-4 w-4" />}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-bold mb-4">{currentTab}</h2>
          <ScrollArea className="overflow-y-auto w-full">
            <Tabs
              className="pr-4 pl-1 pb-8"
              value={currentTab}
              orientation="vertical"
              defaultValue="font"
            >
              <TabsContent value={TABS[0]}>
                <FontSelect />
              </TabsContent>
              <TabsContent value={TABS[1]}>
                <p className="-mt-3 text-muted-foreground">
                  Some <b>Soundpacks</b> don't offer the same functionality as
                  the others.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {sounds.map((sound) => (
                    <SoundPackItem
                      key={sound.id}
                      className="min-w-[12rem] col-span-2 md:col-span-1"
                      soundPack={sound}
                      title={sound.name}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value={TABS[2]} className="flex gap-4">
                <ThemeSwitcher />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
