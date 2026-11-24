import { describe,expect,it } from "vitest";
import { isAllowedBackendOrigin } from "@/lib/backend-origin";
describe("backend origin policy",()=>{
 it("allows private LAN HTTP for mobile development only",()=>{
  for(const host of ["192.168.194.108","10.0.0.5","172.16.1.1","172.31.255.254"]) {
   expect(isAllowedBackendOrigin(new URL(`http://${host}:8000`),true)).toBe(true);
   expect(isAllowedBackendOrigin(new URL(`http://${host}:8000`),false)).toBe(false);
  }
 });
 it("rejects public insecure origins and non-HTTP schemes",()=>{
  for(const origin of ["http://example.com","http://8.8.8.8","http://172.32.0.1","ftp://localhost","http://192.169.1.1"])expect(isAllowedBackendOrigin(new URL(origin),true)).toBe(false);
  expect(isAllowedBackendOrigin(new URL("https://api.example.com"),false)).toBe(true);
  expect(isAllowedBackendOrigin(new URL("http://127.0.0.1:8000"),false)).toBe(true);
 });
});
