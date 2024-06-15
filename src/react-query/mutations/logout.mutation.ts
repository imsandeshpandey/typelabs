import { axios } from '@/config/axios.config'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
type OmittedKeys = 'mutationKey' | 'mutationFn'
type useLogoutOptions = Omit<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UseMutationOptions<AxiosResponse<void, any>, Error, void, unknown>,
  OmittedKeys
>
export const useLogout = (options?: useLogoutOptions) =>
  useMutation({
    mutationKey: ['logout'],
    mutationFn: () =>
      axios.post(
        '/logout',
        {},
        {
          withCredentials: true,
        }
      ),
    onSuccess: (...args) => {
      window.location.reload()
      options?.onSuccess?.(...args)
    },
    ...options,
  })
