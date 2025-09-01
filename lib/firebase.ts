// Stub Firebase for compatibility
// This is replaced by the new admin authentication system

export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: () => Promise.reject(new Error('Use new admin auth system')),
  signOut: () => Promise.resolve()
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    })
  })
};
