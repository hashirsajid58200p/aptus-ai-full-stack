import { AppearanceSettings } from "@/components/appearance-settings"
import { ButtonGroupDemo } from "@/components/button-group-demo"
import { ButtonGroupInputGroup } from "@/components/button-group-input-group"
import { ButtonGroupNested } from "@/components/button-group-nested"
import { ButtonGroupPopover } from "@/components/button-group-popover"
import { EmptyAvatarGroup } from "@/components/empty-avatar-group"
import { FieldDemo } from "@/components/field-demo"
import { FieldSlider } from "@/components/field-slider"
import { InputGroupButtonExample } from "@/components/input-group-button"
import { InputGroupDemo } from "@/components/input-group-demo"
import { ItemDemo } from "@/components/item-demo"
import { NotionPromptForm } from "@/components/notion-prompt-form"
import { SpinnerBadge } from "@/components/spinner-badge"
import { SpinnerEmpty } from "@/components/spinner-empty"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Card } from "@/components/ui/card"
import { ThemeHeader } from "@/components/theme-header"

export default function Page() {
  return (
    <div className="min-h-screen">
      <ThemeHeader />
      <div className="@container font-sans p-4">
        <div className="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
          <div className="order-1 flex flex-col gap-4">
            <Card className="p-6">
              <FieldDemo />
            </Card>
          </div>
          <div className="order-2 flex flex-col gap-4">
            <Card className="p-6 *:[div]:border">
              <EmptyAvatarGroup />
            </Card>
            <Card className="p-6">
              <ButtonGroupInputGroup />
            </Card>
            <Card className="p-6">
              <FieldSlider />
            </Card>
            <Card className="p-6">
              <InputGroupDemo />
            </Card>
          </div>
          <div className="order-3 flex flex-col gap-4 @md:col-span-2 @4xl:col-span-1">
            <div className="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-1">
              <Card className="p-6">
                <ItemDemo />
              </Card>
              <Card className="p-6">
                <FieldSeparator>Appearance Settings</FieldSeparator>
                <AppearanceSettings />
              </Card>
            </div>
          </div>
          <div className="order-first flex flex-col gap-4 @4xl:order-4 @md:col-span-2 @4xl:col-span-3 @6xl:col-span-1">
            <Card className="p-6 flex gap-2">
              <SpinnerBadge />
            </Card>
            <Card className="p-6">
              <InputGroupButtonExample />
            </Card>
            <Card className="p-6">
              <NotionPromptForm />
            </Card>
            <Card className="p-6">
              <ButtonGroupDemo />
            </Card>
            <Card className="p-6">
              <Field orientation="horizontal">
                <Checkbox id="checkbox-demo" defaultChecked />
                <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
                  I agree to the terms and conditions
                </FieldLabel>
              </Field>
            </Card>
            <Card className="p-6 flex gap-4">
              <ButtonGroupNested />
              <ButtonGroupPopover />
            </Card>
            <Card className="p-6 *:[div]:border">
              <SpinnerEmpty />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
